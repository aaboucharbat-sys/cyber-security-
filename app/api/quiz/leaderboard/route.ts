import { NextResponse } from "next/server";
import { getLeaderboard } from "@/lib/quiz-data";

export async function GET() {
  try {
    const leaderboard = await getLeaderboard();

    return NextResponse.json(
      {
        success: true,
        leaderboard,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching leaderboard:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch leaderboard",
        leaderboard: [],
      },
      { status: 500 }
    );
  }
}