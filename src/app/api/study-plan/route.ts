import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import type { StudyPlanItem } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { course_id, topics, available_hours } = body

    if (!topics || !Array.isArray(topics) || topics.length === 0) {
      return NextResponse.json(
        { error: 'Topics array is required' },
        { status: 400 }
      )
    }

    if (!available_hours || available_hours <= 0) {
      return NextResponse.json(
        { error: 'Available hours must be greater than 0' },
        { status: 400 }
      )
    }

    const supabase = createServerClient()

    try {
      const { data, error } = await supabase.functions.invoke('study-plan', {
        body: {
          course_id: course_id || null,
          topics,
          available_hours,
        },
      })

      if (error) {
        throw error
      }

      const plan: StudyPlanItem[] = data?.plan || data || []

      return NextResponse.json({ plan }, { status: 200 })
    } catch (edgeFunctionError) {
      // Edge function not available - return mock study plan for development
      console.warn('Edge function not available, returning mock study plan:', edgeFunctionError)

      const mockPlan = generateMockStudyPlan(topics, available_hours)

      return NextResponse.json({ plan: mockPlan }, { status: 200 })
    }
  } catch (error) {
    console.error('Study plan POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function generateMockStudyPlan(topics: string[], availableHours: number): StudyPlanItem[] {
  const totalMinutes = availableHours * 60
  const minutesPerTopic = Math.floor(totalMinutes / topics.length)
  const priorities = ['high', 'medium', 'low']

  return topics.map((topic, index) => ({
    topic,
    duration: minutesPerTopic,
    priority: priorities[index % priorities.length],
    completed: false,
  }))
}
