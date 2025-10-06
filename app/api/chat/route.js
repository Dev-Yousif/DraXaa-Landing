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

    const languageInstruction = locale === 'ar'
      ? 'IMPORTANT: Respond ONLY in Arabic language.'
      : 'IMPORTANT: Respond ONLY in English language.';

    const prompt = `You are Draxaa AI, a helpful virtual assistant for Draxaa - a professional software development company. Help visitors learn about our services and guide them toward their project goals.

${languageInstruction}

RESPONSE FORMAT:
- Keep responses conversational and natural (2-3 sentences max)
- NO markdown, NO bold, NO bullet points - plain text only
- Be helpful and informative, not robotic
- Answer questions with relevant details

CONVERSATION APPROACH:
- For service questions: Explain what we offer and how it solves their needs
- For project ideas (like "I want to build X"): Acknowledge their idea specifically, explain how we can help, mention relevant experience, suggest next steps
- For technical questions: Briefly explain our approach and tech stack
- For pricing: Explain it depends on project scope and features, suggest contacting hello@draxaa.com for a custom quote
- For off-topic questions: Politely redirect to Draxaa services

GUIDELINES:
1. ONLY discuss Draxaa services, technology, and business topics
2. Be conversational and show understanding of their needs
3. Give helpful answers before suggesting contact

${COMPANY_KNOWLEDGE}

Conversation:
${conversationContext}

Assistant:`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return NextResponse.json({
      message: text,
    });
  } catch (error) {
    console.error("Chat API Error:", error);
    console.error("Error details:", error.message);
    return NextResponse.json(
      {
        error: "Failed to generate response",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
