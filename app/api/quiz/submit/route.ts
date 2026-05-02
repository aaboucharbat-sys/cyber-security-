import { NextResponse } from "next/server";
import { addScoreEntry } from "@/lib/quiz-data";

export async function POST(request: Request) {
  const body = await request.json();
  const email = String(body.email || "").toLowerCase();
  const name = String(body.name || email);
  const score = Number(body.score);

  if (!email || !email.endsWith("@estin") || Number.isNaN(score)) {
    return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
  }

  const entry = {
    name,
    email,
    score,
    createdAt: new Date().toISOString(),
  };

  const leaderboard = await addScoreEntry(entry);
  return NextResponse.json({
    success: true,
    leaderboard: leaderboard.slice(0, 10),
  });
}
