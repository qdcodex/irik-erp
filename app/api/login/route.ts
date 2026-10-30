import { connectDB } from "@/lib/db";
import { User } from "@/lib/models";
import { authStore } from "@/lib/auth-store";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    // Attempt MongoDB connection if available
    try {
      if (process.env.MONGODB_URI) {
        await connectDB();
        const user = await User.findOne({ username });
        if (user && user.password === password) {
          const { password: _, ...userWithoutPassword } = user.toObject();
          return NextResponse.json(userWithoutPassword);
        }
      }
    } catch (dbError) {
      console.warn("Database lookup failed, falling back to in-memory auth store:", dbError);
    }

    // Fallback to in-memory mock store
    const authUser = authStore.login(username, password);
    if (authUser) {
      return NextResponse.json(authUser);
    }

    return NextResponse.json(
      { error: "Invalid username or password" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}
