import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface SummarizeRequest {
  content: string
  note_id: string
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const apiKey = Deno.env.get('GEMINI_API_KEY')
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured')
    }

    const { content, note_id }: SummarizeRequest = await req.json()

    if (!content) {
      return new Response(
        JSON.stringify({ error: 'Content is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!note_id) {
      return new Response(
        JSON.stringify({ error: 'note_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `Summarize the following study notes into a concise, well-structured summary. Focus on key concepts, important definitions, and main takeaways. Keep the summary brief (2-4 sentences) but comprehensive enough to serve as a quick review.

Notes:
${content}`,
                },
              ],
            },
          ],
          systemInstruction: {
            parts: [
              {
                text: 'You are an academic summarization assistant. Create concise, accurate summaries of student notes that capture the essential information. Use clear, simple language. Do not add information not present in the original notes.',
              },
            ],
          },
          generationConfig: {
            temperature: 0.3,
            topK: 20,
            topP: 0.8,
            maxOutputTokens: 512,
          },
        }),
      }
    )

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Gemini API error: ${response.status} - ${error}`)
    }

    const data = await response.json()
    const summary = data?.candidates?.[0]?.content?.parts?.[0]?.text

    if (!summary) {
      throw new Error('No summary generated from Gemini API')
    }

    return new Response(
      JSON.stringify({ summary, note_id }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
