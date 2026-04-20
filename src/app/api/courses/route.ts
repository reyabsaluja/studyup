import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = createServerClient()

    const { data: courses, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching courses:', error)
      return NextResponse.json({ courses: [] }, { status: 200 })
    }

    return NextResponse.json({ courses: courses ?? [] }, { status: 200 })
  } catch (error) {
    console.error('Courses GET error:', error)
    return NextResponse.json({ courses: [] }, { status: 200 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, color, icon, user_id } = body

    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    const supabase = createServerClient()

    const { data: course, error } = await supabase
      .from('courses')
      .insert({
        title: title.trim(),
        description: description || '',
        color: color || '#8B5CF6',
        icon: icon || '📚',
        user_id,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating course:', error)
      return NextResponse.json(
        { error: 'Failed to create course' },
        { status: 500 }
      )
    }

    return NextResponse.json({ course }, { status: 201 })
  } catch (error) {
    console.error('Courses POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
