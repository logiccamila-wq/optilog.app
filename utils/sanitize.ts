export function sanitizeHtml(input: string): string {
  if (!input) return '';
  let html = input;
  // Remove <script> e <style>
  html = html.replace(/<\s*script[^>]*>[\s\S]*?<\s*\/\s*script\s*>/gi, '');
  html = html.replace(/<\s*style[^>]*>[\s\S]*?<\s*\/\s*style\s*>/gi, '');
  // Remove iframes/objects/embed
  html = html.replace(/<\s*(iframe|object|embed)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, '');
  // Bloqueia javascript: em href/src
  html = html.replace(/(href|src)\s*=\s*(["'])\s*javascript:[^\2]*\2/gi, '$1="#"');
  // Remove handlers on*
  html = html.replace(/\son[a-z]+\s*=\s*"[^"]*"/gi, '')
             .replace(/\son[a-z]+\s*=\s*'[^']*'/gi, '')
             .replace(/\son[a-z]+\s*=\s*[^\s>]+/gi, '');
  return html;
}