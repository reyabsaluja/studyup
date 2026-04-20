import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import path from 'path'

// Types
export interface Recommendation {
  id: string
  title: string
  description: string
  type: string
  priority: number
  resourceUrl: string
}

export interface AnalyticsSummary {
  userId: string
  totalStudyHours: number
  sessionsCompleted: number
  averageScore: number
  topicBreakdown: TopicBreakdown[]
  dailyActivity: DailyActivity[]
}

interface TopicBreakdown {
  topic: string
  hoursSpent: number
  masteryLevel: number
}

interface DailyActivity {
  date: string
  hours: number
  sessions: number
}

// Load proto definition
const PROTO_PATH = path.resolve(__dirname, '../../../../proto/studyup.proto')
const GRPC_HOST = process.env.GRPC_HOST || 'localhost:50051'

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: false,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
})

const proto = grpc.loadPackageDefinition(packageDefinition) as any
const StudyServiceClient = proto.studyup.StudyService

let client: any = null

function getClient() {
  if (!client) {
    client = new StudyServiceClient(
      GRPC_HOST,
      grpc.credentials.createInsecure()
    )
  }
  return client
}

function promisify<TReq, TRes>(method: Function): (request: TReq) => Promise<TRes> {
  return (request: TReq) => {
    return new Promise<TRes>((resolve, reject) => {
      method.call(getClient(), request, (error: grpc.ServiceError | null, response: TRes) => {
        if (error) {
          reject(error)
        } else {
          resolve(response)
        }
      })
    })
  }
}

export async function getStudyRecommendations(
  userId: string,
  courseId: string
): Promise<Recommendation[]> {
  try {
    const request = { userId, courseId }
    const call = promisify<typeof request, { recommendations: Recommendation[] }>(
      getClient().getStudyRecommendations
    )
    const response = await call(request)
    return response.recommendations || []
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error(`gRPC getStudyRecommendations failed: ${message}`)
    return []
  }
}

export async function logActivity(
  userId: string,
  action: string,
  metadata: Record<string, string>
): Promise<void> {
  try {
    const request = {
      userId,
      action,
      metadata,
      timestamp: Date.now(),
    }
    const call = promisify<typeof request, { success: boolean; message: string }>(
      getClient().logActivity
    )
    await call(request)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error(`gRPC logActivity failed: ${message}`)
  }
}

export async function getAnalyticsSummary(
  userId: string,
  dateRange: string
): Promise<AnalyticsSummary> {
  try {
    const request = { userId, dateRange }
    const call = promisify<typeof request, AnalyticsSummary>(
      getClient().getAnalyticsSummary
    )
    return await call(request)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error(`gRPC getAnalyticsSummary failed: ${message}`)
    return {
      userId,
      totalStudyHours: 0,
      sessionsCompleted: 0,
      averageScore: 0,
      topicBreakdown: [],
      dailyActivity: [],
    }
  }
}
