import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth-utils"

export async function GET(req: NextRequest) {
  try {
    console.log('Auth check API: Attempting to get auth user')
    const user = await getAuthUser(req)

    if (!user) {
      console.log('Auth check API: Authentication failed - no user found')
      return NextResponse.json(
        { authenticated: false, message: "Not authenticated" },
        { status: 401 }
      )
    }

    console.log('Auth check API: User authenticated successfully:', user._id)
    return NextResponse.json({
      authenticated: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    })
  } catch (error) {
    console.error('Auth check API error:', error)
    return NextResponse.json(
      { authenticated: false, message: "Error checking authentication" },
      { status: 500 }
    )
  }
}
