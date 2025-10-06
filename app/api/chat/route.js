import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const { message, history } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash"
    });

    // Build conversation history for context
    let conversationContext = "";
    if (history && history.length > 0) {
      conversationContext = history
        .map((msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
        .join("\n");
      conversationContext += `\nUser: ${message}`;
    } else {
      conversationContext = `User: ${message}`;
    }

    const prompt = `You are Layla, a friendly and helpful AI assistant for a software development company website. You should be professional, conversational, and helpful. Keep responses concise but informative.\n\nConversation:\n${conversationContext}\n\nAssistant:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({
      message: text,
      success: true,
    });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate response",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
