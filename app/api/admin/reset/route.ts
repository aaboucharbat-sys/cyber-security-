import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions, adminEmails } from "@/lib/auth";
import { resetLeaderboard } from "@/lib/quiz-data";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email?.toLowerCase() || "";

    if (!adminEmails.includes(email)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 },
      );
    }

    await resetLeaderboard();

    return NextResponse.json(
      { success: true, message: "Leaderboard reset successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error resetting leaderboard:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 },
    );
  }
}
