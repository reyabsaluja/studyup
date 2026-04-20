import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

// import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
//
// const s3Client = new S3Client({
//   region: process.env.AWS_REGION || 'us-east-1',
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
//   },
// })
//
// async function uploadToS3(file: Buffer, fileName: string, contentType: string): Promise<string> {
//   const key = `uploads/${Date.now()}-${fileName}`
//   const command = new PutObjectCommand({
//     Bucket: process.env.AWS_S3_BUCKET!,
//     Key: key,
//     Body: file,
//     ContentType: contentType,
//   })
//   await s3Client.send(command)
//   return key
// }

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const courseId = formData.get('course_id') as string | null
    const assignmentId = formData.get('assignment_id') as string | null
    const userId = formData.get('user_id') as string | null

    if (!file) {
      return NextResponse.json(
        { error: 'File is required' },
        { status: 400 }
      )
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const supabase = createServerClient()

    // Upload to Supabase Storage
    const fileBuffer = Buffer.from(await file.arrayBuffer())
    const fileName = `${Date.now()}-${file.name}`
    const storagePath = `${userId}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('uploads')
      .upload(storagePath, fileBuffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('Error uploading file to storage:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload file' },
        { status: 500 }
      )
    }

    // Optionally upload to S3
    let s3Key: string | null = null
    // try {
    //   s3Key = await uploadToS3(fileBuffer, file.name, file.type)
    // } catch (s3Error) {
    //   console.warn('S3 upload skipped or failed:', s3Error)
    // }

    // Save file metadata to database
    const { data: fileUpload, error: dbError } = await supabase
      .from('file_uploads')
      .insert({
        user_id: userId,
        course_id: courseId || null,
        assignment_id: assignmentId || null,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
        storage_path: storagePath,
        s3_key: s3Key,
      })
      .select()
      .single()

    if (dbError) {
      console.error('Error saving file metadata:', dbError)
      return NextResponse.json(
        { error: 'File uploaded but metadata save failed' },
        { status: 500 }
      )
    }

    return NextResponse.json({ file: fileUpload }, { status: 201 })
  } catch (error) {
    console.error('Upload POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
