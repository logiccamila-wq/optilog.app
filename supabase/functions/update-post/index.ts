import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Helper function to decode JWT and get user ID
function getUserIdFromJwt(token: string): string | null {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload);
    const jwtPayload = JSON.parse(decoded);
    return jwtPayload.sub; // 'sub' claim is the user ID in Supabase JWTs
  } catch (e) {
    console.error("Error decoding JWT:", e);
    return null;
  }
}

serve(async (req: Request) => {
  // This function is called for every request
  if (req.method !== 'POST') { // Using POST for simplicity, but PUT or PATCH are also options
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    // 1. Get user ID from auth token
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const userId = getUserIdFromJwt(token);

    if (!userId) {
      return new Response(JSON.stringify({ error: 'Invalid or missing authentication token' }), { status: 401 });
    }

    // 2. Get updated post data from request body
    const { post_id, title, content } = await req.json();
    if (!post_id || !title || !content) {
      return new Response(JSON.stringify({ error: 'Missing post_id, title, or content' }), { status: 400 });
    }

    // 3. Create an admin client to update the data
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // 4. Update the post, but only if the author_id matches the user ID from the token.
    // This is a critical security check because the service_role_key bypasses RLS.
    const { data, error } = await supabaseAdmin
      .from('posts')
      .update({ title, content, updated_at: new Date().toISOString() })
      .match({ id: post_id, author_id: userId }) // Match both post ID and author ID
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error("Post not found or user is not authorized to edit this post.");

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
