import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const products = await executeQuery(`
      SELECT p.*, c.name as categoryName, c.name as category 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = TRUE
      ORDER BY p.created_at DESC
    `);
    
    const formattedProducts = (products as any[]).map(p => ({
      ...p,
      weight_options: typeof p.weight_options === 'string' ? p.weight_options.split(',').map((s: string) => s.trim()) : p.weight_options
    }));

    return NextResponse.json(formattedProducts);
  } catch (error: any) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Failed to fetch products', message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions) as any;
    if (!session || session.user?.role !== 'admin') {
        return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { 
      name, description, price, discount_price, 
      category, weight_unit, weight_options, 
      image_url, stock, tags, is_featured 
    } = body;

    // Map category name to ID
    const categories: any = await executeQuery('SELECT id FROM categories WHERE name = ?', [category || 'Classic']);
    const category_id = categories[0]?.id || 1;

    const result: any = await executeQuery(
      `INSERT INTO products 
      (name, description, price, discount_price, category_id, weight_unit, weight_options, image_url, stock_quantity, tags, is_featured) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name, description, price, discount_price || null, 
        category_id, weight_unit || 'kg', 
        Array.isArray(weight_options) ? weight_options.join(', ') : (weight_options || '250g, 500g, 1kg'), 
        image_url, stock || 0, 
        Array.isArray(tags) ? tags.join(', ') : tags,
        is_featured ? 1 : 0
      ]
    );

    return NextResponse.json({ 
      message: 'Product created successfully', 
      productId: result.insertId 
    }, { status: 201 });
  } catch (error: any) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Failed to create product', message: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
    try {
      const session = await getServerSession(authOptions) as any;
      if (!session || session.user?.role !== 'admin') {
          return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
      }
  
      const body = await request.json();
      const { id, category, stock, tags, is_featured, ...updates } = body;
  
      if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
  
      const preparedUpdates: any = { ...updates };
      
      if (category) {
        const cats: any = await executeQuery('SELECT id FROM categories WHERE name = ?', [category]);
        if (cats[0]) preparedUpdates.category_id = cats[0].id;
      }
      
      if (stock !== undefined) preparedUpdates.stock_quantity = stock;
      if (tags !== undefined) preparedUpdates.tags = Array.isArray(tags) ? tags.join(', ') : tags;
      if (is_featured !== undefined) preparedUpdates.is_featured = is_featured ? 1 : 0;

      const keys = Object.keys(preparedUpdates);
      const values = Object.values(preparedUpdates);
      const setClause = keys.map(key => `${key} = ?`).join(', ');
  
      await executeQuery(
        `UPDATE products SET ${setClause} WHERE id = ?`,
        [...values, id]
      );
  
      return NextResponse.json({ message: 'Product updated successfully' });
    } catch (error: any) {
      console.error('Update failed:', error);
      return NextResponse.json({ error: 'Update failed', message: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
      const session = await getServerSession(authOptions) as any;
      if (!session || session.user?.role !== 'admin') {
          return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
      }
  
      const { searchParams } = new URL(request.url);
      const id = searchParams.get('id');
  
      if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
  
      await executeQuery('UPDATE products SET is_active = FALSE WHERE id = ?', [id]);
  
      return NextResponse.json({ message: 'Product deactivated successfully' });
    } catch (error: any) {
      return NextResponse.json({ error: 'Delete failed', message: error.message }, { status: 500 });
    }
}
