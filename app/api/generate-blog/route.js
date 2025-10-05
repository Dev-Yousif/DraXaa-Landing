import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(request) {
  try {
    const { topic } = await request.json();

    if (!topic) {
      return NextResponse.json(
        { error: "Topic is required" },
        { status: 400 }
      );
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash"
    });

    // Professional system prompt for software company blog
    const prompt = `You are a professional content writer for a leading software development company. Write a comprehensive, SEO-optimized blog post about the following topic: "${topic}"

The blog post should:
- Be written in a professional, informative tone suitable for a B2B software company
- Include technical insights and industry expertise
- Be approximately 800-1200 words
- Use markdown formatting (headers, lists, bold, etc.)
- Include practical examples and actionable insights
- Target decision-makers, CTOs, developers, and business leaders
- Be engaging and authoritative

Please format your response as a JSON object with the following structure:
{
  "title": "Compelling blog post title (50-60 characters)",
  "content": "Full blog post content in markdown format",
  "excerpt": "Brief summary (150-160 characters)",
  "metaTitle": "SEO-optimized meta title (50-60 characters)",
  "metaDescription": "SEO meta description (150-160 characters)",
  "metaKeywords": "5-7 relevant keywords, comma-separated"
}

IMPORTANT: Return ONLY valid JSON, no additional text or formatting.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    let blogData;
    try {
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        blogData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      // Fallback: create structured data from plain text
      const lines = text.split('\n').filter(line => line.trim());
      blogData = {
        title: topic,
        content: text,
        excerpt: lines[0]?.substring(0, 160) || `A comprehensive guide about ${topic}`,
        metaTitle: topic.substring(0, 60),
        metaDescription: lines[0]?.substring(0, 160) || `Learn about ${topic}`,
        metaKeywords: topic.split(' ').slice(0, 5).join(', ')
      };
    }

    // Use AI to generate better image search keywords based on the content
    let imageUrl = "";
    try {
      // Generate image search keywords using AI for better relevance
      const imageKeywordPrompt = `Based on this blog topic: "${topic}", generate 2-3 specific, visual keywords that would find the most relevant professional stock photo. Return ONLY the keywords separated by commas, nothing else.

Examples:
- For "Cloud Computing Benefits": cloud server, data center, technology
- For "Cybersecurity Tips": security lock, network protection, encryption
- For "Mobile App Development": smartphone coding, app development, mobile developer

Topic: "${topic}"
Keywords:`;

      const keywordResult = await model.generateContent(imageKeywordPrompt);
      const keywordResponse = await keywordResult.response;
      const keywords = keywordResponse.text().trim().replace(/['"]/g, '');

      console.log("AI-generated image keywords:", keywords);

      // Use AI-generated keywords for image search
      const searchQuery = keywords.split(',').slice(0, 3).map(k => k.trim()).join(' ');
      const encodedQuery = encodeURIComponent(searchQuery);

      console.log("Fetching image with query:", searchQuery);

      // Try Pixabay API (free, 25k requests/day with API key)
      const pixabayKey = process.env.PIXABAY_API_KEY || "46737153-a6cb2a9e2bd5c77f14a88e2ab";
      const pixabayResponse = await fetch(
        `https://pixabay.com/api/?key=${pixabayKey}&q=${encodedQuery}&image_type=photo&orientation=horizontal&per_page=5&safesearch=true&category=computer,business`
      );

      if (pixabayResponse.ok) {
        const data = await pixabayResponse.json();
        console.log("Pixabay response:", data.totalHits, "images found");
        if (data.hits && data.hits.length > 0) {
          // Get random image from first 5 results for variety
          const randomIndex = Math.floor(Math.random() * Math.min(data.hits.length, 5));
          imageUrl = data.hits[randomIndex].largeImageURL || data.hits[randomIndex].webformatURL;
          console.log("Selected image from Pixabay:", imageUrl);
        }
      } else {
        console.log("Pixabay API failed:", pixabayResponse.status);
      }

      // Fallback to Unsplash source URL if Pixabay fails
      if (!imageUrl) {
        imageUrl = `https://source.unsplash.com/1200x630/?${encodedQuery}`;
        console.log("Using Unsplash fallback:", imageUrl);
      }
    } catch (imageError) {
      console.error("Error fetching image:", imageError);
      // Ultimate fallback - use topic directly
      const fallbackQuery = encodeURIComponent(topic.split(' ').slice(0, 3).join(' '));
      imageUrl = `https://source.unsplash.com/1200x630/?${fallbackQuery},technology`;
      console.log("Using ultimate fallback:", imageUrl);
    }

    // Ensure we always have an image URL
    if (!imageUrl) {
      imageUrl = "https://source.unsplash.com/1200x630/?technology,software,business";
      console.log("Using default fallback image");
    }

    // Add image to blog data
    blogData.image = imageUrl;
    blogData.ogImage = imageUrl;

    console.log("Final blog data with image:", {
      title: blogData.title,
      image: blogData.image
    });

    return NextResponse.json(blogData);
  } catch (error) {
    console.error("Error generating blog with AI:", error);
    return NextResponse.json(
      { error: "Failed to generate blog post. Please try again." },
      { status: 500 }
    );
  }
}
