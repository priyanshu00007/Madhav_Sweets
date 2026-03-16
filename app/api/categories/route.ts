import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function GET() {
  try {
    const categories = await executeQuery('SELECT * FROM categories');
    return NextResponse.json(categories);
  } catch (error: any) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Failed to fetch categories', message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description } = body;

    const result: any = await executeQuery(
      'INSERT INTO categories (name, description) VALUES (?, ?)',
      [name, description]
    );

    return NextResponse.json({
      message: 'Category created successfully',
      categoryId: result.insertId
    }, { status: 201 });
  } catch (error: any) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Failed to create category', message: error.message }, { status: 500 });
  }
}
