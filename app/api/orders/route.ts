import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { executeQuery } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { items, total, formData } = body;

    // 1. Get User ID or create a guest user entry (for now we require login)
    const users: any = await executeQuery('SELECT id FROM users WHERE email = ?', [session.user.email]);
    if (users.length === 0) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    const userId = users[0].id;

    // 2. Create Order
    const orderResult: any = await executeQuery(
      'INSERT INTO orders (user_id, total_amount, status_id, payment_status) VALUES (?, ?, ?, ?)',
      [userId, total, 1, formData.paymentMethod === 'cod' ? 'Pending' : 'Completed']
    );

    const orderId = orderResult.insertId;

    // 3. Create Order Items
    for (const item of items) {
      await executeQuery(
        'INSERT INTO order_items (order_id, product_id, quantity, weight_selected, price_at_purchase) VALUES (?, ?, ?, ?, ?)',
        [orderId, item.id, item.quantity, item.selectedWeight || '1kg', item.price]
      );
    }

    return NextResponse.json({ message: 'Order created', orderId }, { status: 201 });
  } catch (error: any) {
    console.error('Order Error:', error);
    return NextResponse.json({ error: 'Failed to create order', message: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const session: any = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = session.user.email === 'admin@ambrosia.com';
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('id');

    // 1. Fetch Single Order Detail
    if (orderId) {
      const orders: any = await executeQuery(`
        SELECT o.*, s.status_name, u.name as customer_name, u.email as customer_email, r.name as rider_name
        FROM orders o
        JOIN order_statuses s ON o.status_id = s.id
        JOIN users u ON o.user_id = u.id
        LEFT JOIN users r ON o.rider_id = r.id
        WHERE o.id = ?
      `, [orderId]);
      
      if (orders.length === 0) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      
      // Security check: Only owner or admin can see it
      if (!isAdmin && orders[0].customer_email !== session.user.email) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }

      const items = await executeQuery(`
        SELECT oi.*, p.name, p.image_url 
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
      `, [orderId]);

      return NextResponse.json({ ...orders[0], items });
    }

    // 2. Fetch All Orders (Admin) or User Orders
    if (isAdmin) {
      const allOrders = await executeQuery(`
        SELECT o.*, s.status_name, u.name as customerName, u.email as customerEmail, r.name as riderName
        FROM orders o
        JOIN order_statuses s ON o.status_id = s.id
        JOIN users u ON o.user_id = u.id
        LEFT JOIN users r ON o.rider_id = r.id
        ORDER BY o.created_at DESC
      `);
      
      // For items preview in admin, we might need a separate call or a nested JSON approach
      // For simplicity in the admin table, we just return the master records
      return NextResponse.json(allOrders);
    } else {
      const users: any = await executeQuery('SELECT id FROM users WHERE email = ?', [session.user.email]);
      const userId = users[0].id;

      const userOrders = await executeQuery(`
        SELECT o.*, s.status_name, r.name as rider_name
        FROM orders o
        JOIN order_statuses s ON o.status_id = s.id
        LEFT JOIN users r ON o.rider_id = r.id
        WHERE o.user_id = ?
        ORDER BY o.created_at DESC
      `, [userId]) as any[];

      // Hide OTP unless status is 'Reached' (status 7)
      const sanitizedOrders = userOrders.map((order: any) => ({
        ...order,
        delivery_otp: order.status_id === 7 ? order.delivery_otp : null
      }));

      return NextResponse.json(sanitizedOrders);
    }
  } catch (error: any) {
    console.error('Order Fetch Error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
    try {
      const session: any = await getServerSession();
      if (!session || session.user.email !== 'admin@ambrosia.com') {
        return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
      }
  
      const body = await request.json();
      const { orderId, status_id } = body;
  
      await executeQuery(
        'UPDATE orders SET status_id = ? WHERE id = ?',
        [status_id, orderId]
      );
  
      return NextResponse.json({ message: 'Order status updated' });
    } catch (error: any) {
      return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }
  }
