import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "GEMINI_API_KEY not found in environment variables"
        },
        { status: 500 }
      );
    }

    // Test with direct REST API call to different models
    const testModels = [
      "gemini-2.0-flash",
      "gemini-1.5-pro",
      "gemini-1.5-flash",
      "gemini-pro"
    ];

    const results = [];

    for (const modelName of testModels) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [{
                parts: [{
                  text: "Say hello"
                }]
              }]
            })
          }
        );

        const data = await response.json();

        if (response.ok) {
          results.push({
            model: modelName,
            status: "✓ Working",
            response: data.candidates?.[0]?.content?.parts?.[0]?.text || "Success"
          });
          // If we found a working model, return success immediately
          return NextResponse.json({
            success: true,
            message: "🎉 Gemini API key is working!",
            workingModel: modelName,
            apiResponse: data.candidates?.[0]?.content?.parts?.[0]?.text,
            allResults: results,
            timestamp: new Date().toISOString()
          });
        } else {
          results.push({
            model: modelName,
            status: "✗ Failed",
            error: data.error?.message || "Not available"
          });
        }
      } catch (err) {
        results.push({
          model: modelName,
          status: "✗ Error",
          error: err.message
        });
      }
    }

    // If no models worked
    return NextResponse.json({
      success: false,
      error: "❌ No working models found. Your API key might be invalid or expired.",
      testedModels: results,
      suggestion: "Please verify your API key at: https://aistudio.google.com/app/apikey",
      timestamp: new Date().toISOString()
    }, { status: 400 });

  } catch (error) {
    console.error("Gemini API Test Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to connect to Gemini API",
        details: error.toString()
      },
      { status: 500 }
    );
  }
}
