import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, note_id } = body

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    const supabase = createServerClient()

    try {
      const { data, error } = await supabase.functions.invoke('summarize', {
        body: {
          content: content.trim(),
          note_id: note_id || null,
        },
      })

      if (error) {
        throw error
      }

      const summary = typeof data === 'string' ? data : data?.summary || ''

      // If note_id is provided, update the note with the summary
      if (note_id && summary) {
        await supabase
          .from('notes')
          .update({ summary, updated_at: new Date().toISOString() })
          .eq('id', note_id)
      }

      return NextResponse.json({ summary }, { status: 200 })
    } catch (edgeFunctionError) {
      // Edge function not available - return mock summary for development
      console.warn('Edge function not available, returning mock summary:', edgeFunctionError)

      const mockSummary = generateMockSummary(content)

      // If note_id is provided, update the note with the mock summary
      if (note_id) {
        await supabase
          .from('notes')
          .update({ summary: mockSummary, updated_at: new Date().toISOString() })
          .eq('id', note_id)
          .then(({ error }) => {
            if (error) console.error('Error updating note summary:', error)
          })
      }

      return NextResponse.json({ summary: mockSummary }, { status: 200 })
    }
  } catch (error) {
    console.error('Summarize POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function generateMockSummary(content: string): string {
  const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 0)
  const keyPoints = sentences.slice(0, 3).map((s) => s.trim())

  if (keyPoints.length === 0) {
    return 'No meaningful content to summarize.'
  }

  return `Key points: ${keyPoints.join('. ')}. (Mock summary - connect Gemini AI for real summaries)`
}
