import { NextResponse } from 'next/server';
import { auth } from '@/lib/firebase-admin';
import { executeQuery } from '@/lib/db';

/**
 * This API verifies a Firebase ID Token sent from the client.
 * Use this to link Firebase Auth with your MySQL database.
 */
export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();
    
    if (!idToken) {
      return NextResponse.json({ error: 'ID Token is required' }, { status: 400 });
    }

    // 1. Verify the token with Firebase Admin
    const decodedToken = await auth.verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;

    // 2. Sync with MySQL DB
    const users: any = await executeQuery('SELECT * FROM users WHERE email = ?', [email]);
    
    let user;
    if (users.length === 0) {
      // Create user if not exists
      const result: any = await executeQuery(
        'INSERT INTO users (name, email, avatar_url, provider) VALUES (?, ?, ?, ?)',
        [name || 'Firebase User', email, picture || '', 'firebase']
      );
      user = { id: result.insertId, email, name };
    } else {
      user = users[0];
    }

    return NextResponse.json({ 
      success: true, 
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        firebaseUid: uid
      } 
    });

  } catch (error: any) {
    console.error(' [FIREBASE_VERIFY_ERROR]:', error.message);
    return NextResponse.json({ error: 'Invalid token or server error' }, { status: 401 });
  }
}
