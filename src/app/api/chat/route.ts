import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, context_type, context_id, history } = body

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    const supabase = createServerClient()

    try {
      const { data, error } = await supabase.functions.invoke('gemini-chat', {
        body: {
          message: message.trim(),
          context_type: context_type || 'general',
          context_id: context_id || null,
          history: history || [],
        },
      })

      if (error) {
        throw error
      }

      // Return streaming response
      const stream = new ReadableStream({
        start(controller) {
          const encoder = new TextEncoder()
          const text = typeof data === 'string' ? data : data?.response || data?.message || ''
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: text })}\n\n`))
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        },
      })

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      })
    } catch (edgeFunctionError) {
      // Edge function not available - return mock response for development
      console.warn('Edge function not available, returning mock response:', edgeFunctionError)

      const mockResponse = generateMockResponse(message, context_type)

      const stream = new ReadableStream({
        start(controller) {
          const encoder = new TextEncoder()
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: mockResponse })}\n\n`))
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        },
      })

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      })
    }
  } catch (error) {
    console.error('Chat POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function generateMockResponse(message: string, contextType?: string): string {
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes('explain') || lowerMessage.includes('what is')) {
    return `Great question! Here's a brief explanation based on your ${contextType || 'general'} context:\n\nThis is a concept that involves understanding the fundamental principles and applying them in practice. I'd recommend reviewing your notes and trying to connect this with related topics you've studied.\n\n*Note: This is a mock response. Connect to Gemini AI for real answers.*`
  }

  if (lowerMessage.includes('help') || lowerMessage.includes('how')) {
    return `I'd be happy to help! Here are some steps you can follow:\n\n1. Break down the problem into smaller parts\n2. Review relevant course materials\n3. Practice with examples\n4. Test your understanding\n\n*Note: This is a mock response. Connect to Gemini AI for real answers.*`
  }

  return `Thanks for your message! I'm here to help you study effectively. You can ask me to explain concepts, help with assignments, or create study plans.\n\n*Note: This is a mock response. Connect to Gemini AI for real answers.*`
}
