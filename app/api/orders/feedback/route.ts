import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { executeQuery } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions) as any
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { orderId, rating, comment } = await req.json()

    // Update the order with feedback
    await executeQuery(`
      UPDATE orders 
      SET feedback_rating = ?, feedback_comment = ? 
      WHERE id = ? AND user_id = (SELECT id FROM users WHERE email = ?)
    `, [rating, comment, orderId, session.user.email])

    return NextResponse.json({ success: true, message: "Feedback Submitted" })
  } catch (error) {
    console.error("Feedback error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
