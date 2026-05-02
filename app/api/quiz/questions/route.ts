import { NextResponse } from "next/server";
import { questions } from "@/lib/questions";

export async function GET() {
  const payload = questions.map((question, index) => ({
    id: index,
    question: question.question,
    options: question.options,
  }));
  return NextResponse.json({ questions: payload });
}
