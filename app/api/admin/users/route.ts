import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { executeQuery } from "@/lib/db"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions) as any
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const users = await executeQuery(`
      SELECT id, name, email, role, created_at, avatar_url 
      FROM users 
      ORDER BY created_at DESC
    `)

    return NextResponse.json(users)
  } catch (error) {
    console.error("Admin Users GET error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
    try {
      const session = await getServerSession(authOptions) as any
      if (!session || session.user.role !== 'admin') {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
  
      const { userId, role } = await req.json()
      
      await executeQuery(
        'UPDATE users SET role = ? WHERE id = ?',
        [role, userId]
      )
  
      return NextResponse.json({ success: true })
    } catch (error) {
      console.error("Admin User role update error:", error)
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
