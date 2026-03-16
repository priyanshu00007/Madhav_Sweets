import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { login } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { name, email, password, phone } = await request.json();

    if (!name || !email || !password || !phone) {
      return NextResponse.json({ error: 'TACTICAL ERROR: MISSING PROTOCOL DATA' }, { status: 400 });
    }

    // Protocol: Domain Verification
    const emailPattern = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com)$/;
    if (!emailPattern.test(email.toLowerCase())) {
       return NextResponse.json({ error: 'SECURITY ERROR: UNAUTHORIZED TERMINAL DOMAIN' }, { status: 403 });
    }

    // Check if user already exists
    const users: any = await executeQuery('SELECT id FROM users WHERE email = ?', [email]);
    if (users.length > 0) {
      return NextResponse.json({ error: 'COLLISION ERROR: ALIAS ALREADY ENLISTED' }, { status: 400 });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert user
    const result: any = await executeQuery(
      'INSERT INTO users (name, email, password_hash, phone) VALUES (?, ?, ?, ?)',
      [name, email, passwordHash, phone]
    );

    const newUser = { id: result.insertId, name, email };
    
    // Transmit Welcome Protocol
    const { sendEmail, getWelcomeTemplate } = await import('@/lib/mail');
    await sendEmail(email, 'Protocol Enlisted - Ambrosia Supreme', getWelcomeTemplate(name));

    // Create session
    await login(newUser);

    return NextResponse.json({ 
      message: 'ENROLLMENT SUCCESSFUL', 
      user: newUser 
    }, { status: 201 });

  } catch (error: any) {
    console.error('Registration Error:', error);
    return NextResponse.json({ error: 'Internal Server Error', message: error.message }, { status: 500 });
  }
}
