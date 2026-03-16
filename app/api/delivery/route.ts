import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { executeQuery } from "@/lib/db"

// Fetch orders for riders
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions) as any
    if (!session?.user || session.user.role !== 'rider') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type') // 'available' or 'assigned'

    if (type === 'available') {
      // Find orders that are Awaiting Rider (status 3)
      const orders = await executeQuery(`
        SELECT o.*, u.name as customerName, s.status_name 
        FROM orders o 
        JOIN users u ON o.user_id = u.id 
        JOIN order_statuses s ON o.status_id = s.id
        WHERE o.status_id = 3 AND o.rider_id IS NULL
        ORDER BY o.created_at DESC
      `)
      return NextResponse.json(orders)
    } else {
      // Find orders assigned to this rider
      const orders = await executeQuery(`
        SELECT o.*, u.name as customerName, s.status_name 
        FROM orders o 
        JOIN users u ON o.user_id = u.id 
        JOIN order_statuses s ON o.status_id = s.id
        WHERE o.rider_id = (SELECT id FROM users WHERE email = ?)
        ORDER BY o.created_at DESC
      `, [session.user.email])
      return NextResponse.json(orders)
    }
  } catch (error) {
    console.error("Delivery GET error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// Update delivery status
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions) as any
    if (!session?.user || session.user.role !== 'rider') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { orderId, action, otp } = await req.json()
    const riderIdQuery: any = await executeQuery('SELECT id FROM users WHERE email = ?', [session.user.email])
    const riderId = riderIdQuery[0].id

    if (action === 'accept') {
      await executeQuery(
        'UPDATE orders SET rider_id = ?, status_id = 4 WHERE id = ? AND status_id = 3',
        [riderId, orderId]
      )
    } else if (action === 'pickup') {
      await executeQuery(
        'UPDATE orders SET status_id = 5 WHERE id = ? AND rider_id = ?',
        [orderId, riderId]
      )
    } else if (action === 'reached') {
        // Generate OTP when reached
        const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString()
        await executeQuery(
          'UPDATE orders SET status_id = 7, delivery_otp = ? WHERE id = ? AND rider_id = ?',
          [generatedOtp, orderId, riderId]
        )
    } else if (action === 'verify') {
        const order: any = await executeQuery('SELECT delivery_otp FROM orders WHERE id = ? AND rider_id = ?', [orderId, riderId])
        if (order[0]?.delivery_otp === otp) {
            await executeQuery(
                'UPDATE orders SET status_id = 8, payment_status = "Completed" WHERE id = ?',
                [orderId]
            )
            return NextResponse.json({ success: true, message: "Delivery Verified" })
        } else {
            return NextResponse.json({ error: "Invalid OTP" }, { status: 400 })
        }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delivery PATCH error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
