
import 'https://deno.land/x/xhr@0.1.0/mod.ts'
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { stripIndent } from 'https://esm.sh/common-tags@1.8.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { assignmentId } = await req.json()
    if (!assignmentId) {
      throw new Error('assignmentId is required')
    }
    
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const { data: assignment, error: assignmentError } = await supabaseAdmin
      .from('assignments')
      .select('title, description, due_date, course_id')
      .eq('id', assignmentId)
      .single()

    if (assignmentError) throw assignmentError
    if (!assignment) throw new Error('Assignment not found')

    const { data: materials, error: materialsError } = await supabaseAdmin
      .from('assignment_materials')
      .select('title, content')
      .eq('assignment_id', assignmentId)
      .limit(5)

    if (materialsError) throw materialsError

    const materialsContext = materials && materials.length > 0
      ? materials.map(m => `Material: ${m.title}\nContent: ${m.content ? m.content.substring(0, 2000) : 'No text content available'}`).join('\n\n')
      : 'No materials provided.'

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
    if (!geminiApiKey) {
      throw new Error('Gemini API key not configured')
    }
    
    const currentDate = new Date().toISOString();
    const dueDate = new Date(assignment.due_date!).toISOString();

    const prompt = stripIndent`
      You are an expert academic planner. Your task is to create a realistic and effective study plan for a student.

      Assignment Details:
      - Title: ${assignment.title}
      - Description: ${assignment.description || 'No description provided.'}
      - Due Date: ${dueDate}
      - Current Date: ${currentDate}

      Available Study Materials:
      ${materialsContext}

      Instructions:
      1. Analyze the assignment details, materials, and timeline.
      2. Create a series of study sessions. Break down the assignment into manageable tasks.
      3. For each session, provide a title, a brief description of the task, a scheduled date and time (in ISO 8601 format), and a duration in minutes.
      4. Schedule sessions reasonably between the current date and the due date. Avoid scheduling sessions on the due date itself. Spread them out. Prefer scheduling during typical study hours (e.g., afternoon, early evening). A session can be between 30 and 120 minutes.
      5. Provide a clear "rationale" explaining your thought process for the plan. Explain why you structured the sessions this way, referencing the materials and the timeline.
      6. Your entire response MUST be a single, valid JSON object. Do not include any text outside of the JSON structure.

      JSON Output Format:
      {
        "rationale": "A string explaining the study plan.",
        "sessions": [
          {
            "title": "Session Title",
            "description": "What to do in this session.",
            "scheduled_date": "YYYY-MM-DDTHH:MM:SS.sssZ",
            "duration": 60
          }
        ]
      }
    `
    
    const requestBody = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.5,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 4096,
        response_mime_type: "application/json",
      }
    };
    
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      }
    );

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('Gemini API error:', errorText);
      throw new Error('Failed to generate response from Gemini');
    }

    const data = await geminiResponse.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      console.error('Invalid response from Gemini:', JSON.stringify(data, null, 2));
      const reason = data?.promptFeedback?.blockReason || 'unknown reason';
      throw new Error(`AI model blocked the response. Reason: ${reason}`);
    }

    const generatedText = data.candidates[0].content.parts[0].text;
    const plan = JSON.parse(generatedText);

    return new Response(JSON.stringify(plan), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error in generate-study-plan function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
