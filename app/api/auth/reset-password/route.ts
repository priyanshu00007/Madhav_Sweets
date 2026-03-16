import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({ error: 'PROTOCOL ERROR: INVALID INPUT' }, { status: 400 });
    }

    const users: any = await executeQuery(
      'SELECT id FROM users WHERE reset_token = ? AND reset_token_expiry > NOW()',
      [token]
    );

    if (users.length === 0) {
      return NextResponse.json({ error: 'TOKEN EXPIRED: Security credentials invalid.' }, { status: 400 });
    }

    const user = users[0];
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    await executeQuery(
      'UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?',
      [passwordHash, user.id]
    );

    return NextResponse.json({ message: 'RECALIBRATION SUCCESSFUL: Protocol updated.' });

  } catch (error: any) {
    console.error('Reset Hub Error:', error);
    return NextResponse.json({ error: 'SYSTEM FAILURE' }, { status: 500 });
  }
}
