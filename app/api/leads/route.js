import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { sendLeadNotification } from "@/lib/email";

// GET all leads (protected - admin only)
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const where = status ? { status } : {};

    const leads = await prisma.lead.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(leads);
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}

// POST create new lead (public - from contact form)
export async function POST(request) {
  try {
    console.log("📝 Received contact form submission");

    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    console.log("Form data:", { name, email, phone: phone || "N/A", subject: subject || "N/A" });

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const lead = await prisma.lead.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || null,
        subject: subject?.trim() || null,
        message: message.trim(),
        status: "new",
      },
    });

    console.log("📧 Lead created, attempting to send email notification...");

    // Send email notification and wait for result
    try {
      const emailResult = await sendLeadNotification(lead);
      console.log("Email send result:", emailResult);

      if (!emailResult.success) {
        console.error("⚠️ Email failed but continuing:", emailResult.error);
      }
    } catch (error) {
      console.error("❌ Email notification error:", error);
      // Don't fail the request if email fails, but log it properly
    }

    return NextResponse.json(
      { success: true, message: "Thank you! We'll get back to you soon.", lead },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json(
      { error: "Failed to submit form. Please try again." },
      { status: 500 }
    );
  }
}
