import { NextResponse } from "next/server";
import { questions } from "@/lib/questions";

export async function GET() {
  try {
    // Remove correct answers before sending to client
    const payload = questions.map((question, index) => ({
      id: index,
      question: question.question,
      options: question.options,
    }));

    return NextResponse.json(
      { success: true, questions: payload },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching questions:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch questions",
      },
      { status: 500 }
    );
  }
}