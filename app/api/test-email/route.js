import { NextResponse } from "next/server";
import { sendLeadNotification } from "@/lib/email";

export async function GET(request) {
  try {
    // Test email configuration
    const testLead = {
      name: "Test User",
      email: "test@example.com",
      phone: "+1234567890",
      subject: "Test Email from Production",
      message: "This is a test email to verify email functionality in production.",
      createdAt: new Date(),
    };

    console.log("🧪 Testing email configuration...");
    console.log("Environment variables:", {
      EMAIL_HOST: process.env.EMAIL_HOST || "not set",
      EMAIL_PORT: process.env.EMAIL_PORT || "not set",
      EMAIL_USER: process.env.EMAIL_USER ? "✓ set" : "✗ not set",
      EMAIL_PASSWORD: process.env.EMAIL_PASSWORD ? "✓ set" : "✗ not set",
      EMAIL_FROM: process.env.EMAIL_FROM || "not set",
    });

    const result = await sendLeadNotification(testLead);

    return NextResponse.json({
      success: result.success,
      message: result.success ? "Email sent successfully!" : "Email failed to send",
      details: result,
      environment: process.env.NODE_ENV,
    });
  } catch (error) {
    console.error("Test email error:", error);
    return NextResponse.json(
      {
        error: error.message,
        stack: error.stack,
        environment: process.env.NODE_ENV,
      },
      { status: 500 }
    );
  }
}
