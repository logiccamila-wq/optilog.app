import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(request: Request, { params }: { params: { id: string } }) {
    const userId = params.id;

    try {
        // Fetch current user status
        const userResult = await sql`SELECT status FROM users WHERE id = ${userId}`;
        
        // Handle user not found
        if (userResult.rowCount === 0) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }
        
        const currentStatus = userResult.rows[0].status;
        const newStatus = currentStatus === 'active' ? 'suspended' : 'active';

        // Update user status and updated_at timestamp
        await sql`
            UPDATE users
            SET status = ${newStatus}, updated_at = NOW()
            WHERE id = ${userId}
        `;

        // Return success response with updated user data
        return NextResponse.json({
            message: 'User status updated successfully',
            user: { id: userId, status: newStatus }
        });
        
    } catch (error) {
        console.error('Database operation failed:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}