import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('course_id')
    const assignmentId = searchParams.get('assignment_id')

    const supabase = createServerClient()

    let query = supabase
      .from('notes')
      .select('*')
      .order('updated_at', { ascending: false })

    if (courseId) {
      query = query.eq('course_id', courseId)
    }

    if (assignmentId) {
      query = query.eq('assignment_id', assignmentId)
    }

    const { data: notes, error } = await query

    if (error) {
      console.error('Error fetching notes:', error)
      return NextResponse.json({ notes: [] }, { status: 200 })
    }

    return NextResponse.json({ notes: notes ?? [] }, { status: 200 })
  } catch (error) {
    console.error('Notes GET error:', error)
    return NextResponse.json({ notes: [] }, { status: 200 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, course_id, assignment_id, user_id, tags, is_pinned } = body

    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    const supabase = createServerClient()

    const { data: note, error } = await supabase
      .from('notes')
      .insert({
        title: title.trim(),
        content: content || '',
        course_id: course_id || null,
        assignment_id: assignment_id || null,
        user_id,
        tags: tags || [],
        is_pinned: is_pinned || false,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating note:', error)
      return NextResponse.json(
        { error: 'Failed to create note' },
        { status: 500 }
      )
    }

    return NextResponse.json({ note }, { status: 201 })
  } catch (error) {
    console.error('Notes POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, title, content, tags, is_pinned, summary } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Note ID is required' },
        { status: 400 }
      )
    }

    const supabase = createServerClient()

    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() }
    if (title !== undefined) updateData.title = title.trim()
    if (content !== undefined) updateData.content = content
    if (tags !== undefined) updateData.tags = tags
    if (is_pinned !== undefined) updateData.is_pinned = is_pinned
    if (summary !== undefined) updateData.summary = summary

    const { data: note, error } = await supabase
      .from('notes')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating note:', error)
      return NextResponse.json(
        { error: 'Failed to update note' },
        { status: 500 }
      )
    }

    return NextResponse.json({ note }, { status: 200 })
  } catch (error) {
    console.error('Notes PATCH error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
