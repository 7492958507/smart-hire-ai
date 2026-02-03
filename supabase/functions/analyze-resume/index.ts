import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const systemPrompt = `You are an expert resume analyzer. Analyze the provided resume text and extract structured information. Be thorough and accurate.`;

interface AnalyzeRequest {
  resumeText: string;
  jobDescription?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeText, jobDescription } = await req.json() as AnalyzeRequest;
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("AI service is not configured");
    }

    console.log("Analyzing resume, length:", resumeText.length);

    const userPrompt = jobDescription
      ? `Analyze this resume against the job description and provide a match score.

Resume:
${resumeText}

Job Description:
${jobDescription}`
      : `Analyze this resume and extract key information.

Resume:
${resumeText}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "analyze_resume",
              description: "Extract structured data from a resume",
              parameters: {
                type: "object",
                properties: {
                  skills: {
                    type: "array",
                    items: { type: "string" },
                    description: "List of technical and soft skills",
                  },
                  experienceYears: {
                    type: "number",
                    description: "Total years of professional experience",
                  },
                  education: {
                    type: "string",
                    description: "Highest education level and field",
                  },
                  summary: {
                    type: "string",
                    description: "Brief professional summary (2-3 sentences)",
                  },
                  matchScore: {
                    type: "number",
                    description: "Job match score from 0-100 (only if job description provided)",
                  },
                  matchedSkills: {
                    type: "array",
                    items: { type: "string" },
                    description: "Skills that match the job requirements",
                  },
                  missingSkills: {
                    type: "array",
                    items: { type: "string" },
                    description: "Skills required by job but missing from resume",
                  },
                  suggestions: {
                    type: "array",
                    items: { type: "string" },
                    description: "Improvement suggestions for the resume",
                  },
                  overallScore: {
                    type: "number",
                    description: "Overall resume quality score from 0-100",
                  },
                },
                required: ["skills", "experienceYears", "education", "summary", "overallScore"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "analyze_resume" } },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI analysis failed: ${response.status}`);
    }

    const result = await response.json();
    console.log("Analysis complete");

    // Extract the tool call result
    const toolCall = result.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error("Invalid AI response format");
    }

    const analysis = JSON.parse(toolCall.function.arguments);

    return new Response(
      JSON.stringify({ success: true, analysis }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("analyze-resume error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Analysis failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
