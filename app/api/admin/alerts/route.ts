import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'UNAUTHORIZED ACCESS BLOCKED' }, { status: 403 });
  }

  try {
    const alerts = await executeQuery(
      'SELECT * FROM notifications WHERE type = "security" OR user_id IS NULL ORDER BY created_at DESC LIMIT 50'
    );
    return NextResponse.json(alerts);
  } catch (error) {
    console.error('Failed to fetch security alerts:', error);
    return NextResponse.json({ error: 'DATABASE ERROR' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 403 });
    }

    try {
        const { id, is_read } = await request.json();
        await executeQuery('UPDATE notifications SET is_read = ? WHERE id = ?', [is_read ? 1 : 0, id]);
        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: 'UPDATE FAILED' }, { status: 500 });
    }
}
