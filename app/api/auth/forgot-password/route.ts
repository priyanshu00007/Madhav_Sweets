import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import crypto from 'crypto';
import { sendEmail, getResetPasswordTemplate } from '@/lib/mail';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'TACTICAL ERROR: EMAIL REQUIRED' }, { status: 400 });
    }

    const users: any = await executeQuery('SELECT id, name FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      // Security protocol: Do not confirm if a user exists or not
      return NextResponse.json({ message: 'TRANSMISSION SENT: Check your terminal for reset instructions.' });
    }

    const user = users[0];
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    await executeQuery(
      'UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?',
      [resetToken, resetTokenExpiry, user.id]
    );

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

    await sendEmail(
      email,
      'Aegis Reset Protocol - Ambrosia Supreme',
      getResetPasswordTemplate(resetUrl)
    );

    return NextResponse.json({ message: 'TRANSMISSION SENT: Check your terminal for reset instructions.' });

  } catch (error: any) {
    console.error('Forgot Password Hub Error:', error);
    return NextResponse.json({ error: 'SYSTEM FAILURE', message: error.message }, { status: 500 });
  }
}
