import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface ChatRequest {
  message: string
  context_type: 'course' | 'assignment' | 'general'
  context_id?: string
  history?: { role: string; content: string }[]
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

    const { message, context_type, context_id, history = [] }: ChatRequest = await req.json()

    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Build system instruction based on context
    let systemInstruction = `You are StudyUp AI, an intelligent study tutor and academic assistant. Your role is to help students learn effectively, understand concepts deeply, and stay organized with their coursework.

Guidelines:
- Be encouraging and supportive while maintaining academic rigor
- Break down complex topics into digestible explanations
- Use examples and analogies to clarify concepts
- When asked about assignments, help guide thinking without giving direct answers
- Suggest study strategies and time management tips when appropriate
- Keep responses concise but thorough`

    if (context_type === 'course') {
      systemInstruction += `\n\nThe student is currently asking about a specific course. Tailor your responses to be relevant to course material and academic concepts.`
    } else if (context_type === 'assignment') {
      systemInstruction += `\n\nThe student is asking about a specific assignment. Help them understand the requirements and guide them toward a solution without doing the work for them. Encourage critical thinking.`
    }

    // Build conversation history for Gemini
    const contents = []

    // Add history
    for (const msg of history) {
      contents.push({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      })
    }

    // Add current message
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    })

    // Call Gemini API with streaming
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:streamGenerateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          systemInstruction: {
            parts: [{ text: systemInstruction }],
          },
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
          ],
        }),
      }
    )

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Gemini API error: ${response.status} - ${error}`)
    }

    // Stream the response back
    const reader = response.body?.getReader()
    const encoder = new TextEncoder()

    const stream = new ReadableStream({
      async start(controller) {
        if (!reader) {
          controller.close()
          return
        }

        const decoder = new TextDecoder()
        let buffer = ''

        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            buffer += decoder.decode(value, { stream: true })

            // Parse JSON chunks from the streamed response
            const lines = buffer.split('\n')
            buffer = lines.pop() || ''

            for (const line of lines) {
              const trimmed = line.trim()
              if (!trimmed || trimmed === '[' || trimmed === ']' || trimmed === ',') continue

              try {
                const chunk = JSON.parse(trimmed.replace(/^,/, ''))
                const text = chunk?.candidates?.[0]?.content?.parts?.[0]?.text
                if (text) {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`))
                }
              } catch {
                // Skip unparseable chunks
              }
            }
          }
        } finally {
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
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
