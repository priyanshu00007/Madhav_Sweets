import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { sendEmail, getNewsletterWelcomeTemplate } from '@/lib/mail';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'TACTICAL ERROR: DATA MISSING' }, { status: 400 });
    }

    // Domain Verification Protocol
    const emailPattern = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com)$/;
    if (!emailPattern.test(email.toLowerCase())) {
        return NextResponse.json({ error: 'SECURITY ERROR: UNAUTHORIZED TERMINAL DOMAIN' }, { status: 403 });
    }

    // Strategy: Upsert subcription status if user exists, or record as standalone enlistment
    const users: any = await executeQuery('SELECT id, name FROM users WHERE email = ?', [email]);
    
    if (users.length > 0) {
      await executeQuery('UPDATE users SET is_subscribed = 1 WHERE email = ?', [email]);
      await sendEmail(email, 'Vanguard Inner Circle - Enlistment Confirmed', getNewsletterWelcomeTemplate(users[0].name || 'Elite Member'));
    } else {
        // For now, only registered users can join the Inner Circle for security parity
        return NextResponse.json({ error: 'AUTHENTICATION REQUIRED: Enlist in the main database first.' }, { status: 401 });
    }

    return NextResponse.json({ message: 'ENLISTMENT CONFIRMED: Terminal registered for updates.' });

  } catch (error: any) {
    console.error('Newsletter Hub Error:', error);
    return NextResponse.json({ error: 'SYSTEM FAILURE' }, { status: 500 });
  }
}
