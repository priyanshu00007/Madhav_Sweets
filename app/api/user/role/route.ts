import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { executeQuery } from "@/lib/db"

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions) as any
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { role } = await req.json()
    if (!['user', 'rider'].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    // Admins cannot change their role through this endpoint for safety
    if (session.user.role === 'admin') {
      return NextResponse.json({ error: "Administrator roles cannot be downgraded via profile settings." }, { status: 403 })
    }

    await executeQuery(
      'UPDATE users SET role = ? WHERE email = ?',
      [role, session.user.email]
    )

    return NextResponse.json({ success: true, role })
  } catch (error) {
    console.error("Role update error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
