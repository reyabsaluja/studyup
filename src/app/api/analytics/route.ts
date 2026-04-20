import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || 'week'

    const supabase = createServerClient()

    // Calculate date range
    const now = new Date()
    let startDate: Date

    switch (range) {
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
        break
      case 'semester':
        startDate = new Date(now.getFullYear(), now.getMonth() - 4, now.getDate())
        break
      case 'week':
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
        break
    }

    // Fetch study sessions within range
    const { data: sessions, error: sessionsError } = await supabase
      .from('study_sessions')
      .select('*')
      .gte('started_at', startDate.toISOString())
      .order('started_at', { ascending: true })

    if (sessionsError) {
      console.error('Error fetching study sessions:', sessionsError)
      return NextResponse.json(
        { studyData: [], activityData: [], courseDistribution: [] },
        { status: 200 }
      )
    }

    // Aggregate study data by day
    const studyDataMap = new Map<string, number>()
    const courseMinutesMap = new Map<string, number>()

    for (const session of sessions || []) {
      const day = session.started_at.split('T')[0]
      const currentMinutes = studyDataMap.get(day) || 0
      studyDataMap.set(day, currentMinutes + (session.duration_minutes || 0))

      if (session.course_id) {
        const courseMinutes = courseMinutesMap.get(session.course_id) || 0
        courseMinutesMap.set(session.course_id, courseMinutes + (session.duration_minutes || 0))
      }
    }

    const studyData = Array.from(studyDataMap.entries()).map(([date, value]) => ({
      date,
      value,
      label: `${value} min`,
    }))

    // Fetch activity logs for the range
    const { data: activities, error: activitiesError } = await supabase
      .from('activity_logs')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true })

    let activityData: { date: string; value: number; label: string }[] = []

    if (!activitiesError && activities) {
      const activityMap = new Map<string, number>()
      for (const activity of activities) {
        const day = activity.created_at.split('T')[0]
        const count = activityMap.get(day) || 0
        activityMap.set(day, count + 1)
      }
      activityData = Array.from(activityMap.entries()).map(([date, value]) => ({
        date,
        value,
        label: `${value} activities`,
      }))
    }

    // Build course distribution
    const courseDistribution = Array.from(courseMinutesMap.entries()).map(([courseId, minutes]) => ({
      course_id: courseId,
      minutes,
      percentage: 0,
    }))

    const totalMinutes = courseDistribution.reduce((sum, c) => sum + c.minutes, 0)
    if (totalMinutes > 0) {
      for (const entry of courseDistribution) {
        entry.percentage = Math.round((entry.minutes / totalMinutes) * 100)
      }
    }

    return NextResponse.json(
      { studyData, activityData, courseDistribution },
      { status: 200 }
    )
  } catch (error) {
    console.error('Analytics GET error:', error)
    return NextResponse.json(
      { studyData: [], activityData: [], courseDistribution: [] },
      { status: 200 }
    )
  }
}
