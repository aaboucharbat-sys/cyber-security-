import { NextResponse } from "next/server";
import { addScoreEntry } from "@/lib/quiz-data";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email = String(body.email || "")
      .trim()
      .toLowerCase();

    const name = String(body.name || email).trim();
    const score = Number(body.score);

    // Validate ESTIN email and score
    if (
      !email ||
      !email.endsWith("@estin.dz") ||
      Number.isNaN(score) ||
      score < 0 ||
      score > 100
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid submission" },
        { status: 400 },
      );
    }

    const entry = {
      name,
      email,
      score,
      createdAt: new Date().toISOString(),
    };

    const leaderboard = await addScoreEntry(entry);

    return NextResponse.json(
      {
        success: true,
        leaderboard: leaderboard.slice(0, 10),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error submitting score:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 },
    );
  }
}
