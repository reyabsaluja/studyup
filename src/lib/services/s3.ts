// NOTE: @aws-sdk/client-s3 and @aws-sdk/s3-request-presigner are not yet installed.
// Run: npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner

import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const BUCKET = process.env.AWS_S3_BUCKET || ''

function createS3Client(): S3Client {
  return new S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
  })
}

const s3 = createS3Client()

export async function uploadToS3(file: Buffer, key: string, contentType: string): Promise<string> {
  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: file,
      ContentType: contentType,
    })

    await s3.send(command)
    return `https://${BUCKET}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${key}`
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    throw new Error(`Failed to upload to S3: ${message}`)
  }
}

export async function getSignedDownloadUrl(key: string, expiresIn: number = 3600): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET,
      Key: key,
    })

    return await getSignedUrl(s3, command, { expiresIn })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    throw new Error(`Failed to generate signed URL: ${message}`)
  }
}

export async function deleteFromS3(key: string): Promise<void> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: key,
    })

    await s3.send(command)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    throw new Error(`Failed to delete from S3: ${message}`)
  }
}

export { s3, createS3Client }
