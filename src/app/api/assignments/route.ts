import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('course_id')

    const supabase = createServerClient()

    let query = supabase
      .from('assignments')
      .select('*')
      .order('due_date', { ascending: true })

    if (courseId) {
      query = query.eq('course_id', courseId)
    }

    const { data: assignments, error } = await query

    if (error) {
      console.error('Error fetching assignments:', error)
      return NextResponse.json({ assignments: [] }, { status: 200 })
    }

    return NextResponse.json({ assignments: assignments ?? [] }, { status: 200 })
  } catch (error) {
    console.error('Assignments GET error:', error)
    return NextResponse.json({ assignments: [] }, { status: 200 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, due_date, course_id, user_id, status, priority } = body

    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    if (!due_date) {
      return NextResponse.json(
        { error: 'Due date is required' },
        { status: 400 }
      )
    }

    const supabase = createServerClient()

    const { data: assignment, error } = await supabase
      .from('assignments')
      .insert({
        title: title.trim(),
        description: description || '',
        due_date,
        course_id: course_id || null,
        user_id,
        status: status || 'pending',
        priority: priority || 'medium',
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating assignment:', error)
      return NextResponse.json(
        { error: 'Failed to create assignment' },
        { status: 500 }
      )
    }

    return NextResponse.json({ assignment }, { status: 201 })
  } catch (error) {
    console.error('Assignments POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
