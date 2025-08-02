import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (email === "admin@foodmanager.com" && password === "admin123") {
      const user = {
        id: 1,
        email: "admin@foodmanager.com",
        name: "Admin User",
      };

      const response = NextResponse.json(
        {
          message: "Login successful",
          user,
        },
        { status: 200 }
      );

      response.cookies.set("auth-token", "demo-token-123", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      });

      return response;
    } else {
      return NextResponse.json(
        { error: "Email atau password salah" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
