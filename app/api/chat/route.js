import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const COMPANY_KNOWLEDGE = `
# COMPANY INFORMATION
Company Name: Draxaa
Type: Full-service software development company
Location: San Francisco, CA 94102, United States (with global presence in Sydney, Berlin, and Singapore)
Contact: hello@draxaa.com | +1 (555) 123-4567
Website: https://www.draxaa.com

# CORE SERVICES
1. Website Design & Development
   - Custom responsive websites built with modern technologies
   - From landing pages to complex web applications
   - Focus on digital experiences that convert visitors into customers

2. Mobile App Development
   - Native and cross-platform mobile applications for iOS and Android
   - Built with React Native and Flutter
   - High-performance apps that engage users and drive business growth

3. Custom Software Solutions
   - Tailored enterprise software and SaaS platforms
   - Designed to streamline operations
   - Scalable solutions that grow with business

4. E-Commerce Development
   - Full-featured online stores
   - Secure payment integration and inventory management
   - Optimized checkout flows to maximize online revenue

5. UI/UX Design
   - User-centered design combining aesthetics with functionality
   - Beautiful, intuitive, and conversion-optimized interfaces

6. Cloud & DevOps
   - Cloud infrastructure setup (AWS, Google Cloud)
   - Deployment automation and continuous integration
   - Scalable, secure, and always-available applications

# TECHNOLOGY STACK
- Frontend: React, Next.js
- Mobile: React Native, Flutter
- Backend: Node.js, Python
- Cloud: AWS, Google Cloud
- Methodology: Agile development with full transparency

# COMPANY MISSION
Empowering businesses with cutting-edge web and mobile solutions. We transform ideas into scalable, high-performance digital products that drive growth and innovation.

# UNIQUE VALUE PROPOSITIONS
- Agile development process with full transparency
- Regular updates, sprint reviews, and collaborative planning
- Industry-best practices and methodologies
- Cutting-edge technology stack for modern solutions
- Proven track record with industry leaders

# KEY DIFFERENTIATORS
- End-to-end software development services
- From concept to deployment
- Clean code with comprehensive documentation
- Ongoing support for long-term success
- 24/7 support with global team presence

# CLIENT RESULTS
- 40% cost reduction while improving performance
- 150% increase in online sales
- Apps featured in App Store with thousands of active users
- HIPAA-compliant healthcare solutions
- Millions in annual savings through automation
`;

export async function POST(req) {
  try {
    const { message, history, locale } = await req.json();

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

    const isArabic = locale === 'ar';
    const languageInstruction = isArabic
      ? 'IMPORTANT: Respond ONLY in Arabic language. All your responses must be in Arabic.'
      : 'IMPORTANT: Respond ONLY in English language. All your responses must be in English.';

    const prompt = `You are Draxaa AI, an intelligent virtual assistant for Draxaa - a professional software development company. Your role is to help visitors learn about our services, answer questions, and guide them toward getting started with their projects.

${languageInstruction}

IMPORTANT GUIDELINES:
1. ONLY answer questions related to Draxaa's services, technology, pricing, process, and related business topics
2. If asked about topics outside Draxaa's scope (like how to install software, general tutorials, unrelated topics), politely redirect them back to Draxaa services
3. Be professional, friendly, and concise
4. Always try to guide conversations toward how Draxaa can help solve their business problems
5. If asked about pricing, mention it varies by project scope and suggest contacting hello@draxaa.com
6. Promote our contact page at /contact for project inquiries
7. Keep responses under 100 words unless specifically asked for details

${COMPANY_KNOWLEDGE}

Conversation:
${conversationContext}

Assistant:`;

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
