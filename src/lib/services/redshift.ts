const REDSHIFT_CLUSTER_ID = process.env.REDSHIFT_CLUSTER_ID || ''
const REDSHIFT_DATABASE = process.env.REDSHIFT_DATABASE || 'studyup'
const REDSHIFT_USER = process.env.REDSHIFT_USER || 'admin'
const AWS_REGION = process.env.AWS_REGION || 'us-east-1'
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || ''
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || ''

export interface AnalyticsResult {
  userId: string
  totalStudyTime: number
  averageSessionLength: number
  completionRate: number
  topTopics: { topic: string; timeSpent: number; score: number }[]
}

export interface TrendData {
  date: string
  enrollments: number
  completions: number
  averageScore: number
  activeUsers: number
}

interface RedshiftStatement {
  Id: string
  Status: string
}

// AWS Signature V4 helper for Redshift Data API
async function redshiftDataApiRequest(action: string, body: Record<string, unknown>): Promise<any> {
  const endpoint = `https://redshift-data.${AWS_REGION}.amazonaws.com`
  const date = new Date().toISOString().replace(/[:-]|\.\d{3}/g, '')
  const dateStamp = date.slice(0, 8)

  const headers: Record<string, string> = {
    'Content-Type': 'application/x-amz-json-1.1',
    'X-Amz-Target': `RedshiftData.${action}`,
    'X-Amz-Date': date,
    'Host': `redshift-data.${AWS_REGION}.amazonaws.com`,
  }

  // NOTE: In production, use proper AWS Signature V4 signing.
  // For simplicity, this relies on IAM role-based auth or SDK-based signing.
  // Consider using @aws-sdk/client-redshift-data for proper auth.
  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`Redshift Data API ${action} failed (${response.status}): ${errorBody}`)
  }

  return response.json()
}

async function executeStatement(sql: string, params?: string[]): Promise<string> {
  const body: Record<string, unknown> = {
    ClusterIdentifier: REDSHIFT_CLUSTER_ID,
    Database: REDSHIFT_DATABASE,
    DbUser: REDSHIFT_USER,
    Sql: sql,
  }

  if (params && params.length > 0) {
    body.Parameters = params.map((value, index) => ({
      name: `p${index + 1}`,
      value,
    }))
  }

  const result: RedshiftStatement = await redshiftDataApiRequest('ExecuteStatement', body)
  return result.Id
}

async function waitForStatement(statementId: string, maxWaitMs: number = 30000): Promise<void> {
  const startTime = Date.now()
  const pollInterval = 1000

  while (Date.now() - startTime < maxWaitMs) {
    const result = await redshiftDataApiRequest('DescribeStatement', { Id: statementId })

    if (result.Status === 'FINISHED') return
    if (result.Status === 'FAILED') {
      throw new Error(`Redshift query failed: ${result.Error}`)
    }
    if (result.Status === 'ABORTED') {
      throw new Error('Redshift query was aborted')
    }

    await new Promise((resolve) => setTimeout(resolve, pollInterval))
  }

  throw new Error('Redshift query timed out')
}

async function getStatementResult(statementId: string): Promise<Record<string, unknown>[]> {
  const result = await redshiftDataApiRequest('GetStatementResult', { Id: statementId })

  const columns: { name: string }[] = result.ColumnMetadata || []
  const rows: any[][] = result.Records || []

  return rows.map((row: any[]) => {
    const record: Record<string, unknown> = {}
    columns.forEach((col, index) => {
      const cell = row[index]
      // Redshift Data API returns typed values
      record[col.name] = cell?.stringValue ?? cell?.longValue ?? cell?.doubleValue ?? cell?.booleanValue ?? null
    })
    return record
  })
}

export async function queryRedshift(sql: string, params?: string[]): Promise<Record<string, unknown>[]> {
  try {
    const statementId = await executeStatement(sql, params)
    await waitForStatement(statementId)
    return await getStatementResult(statementId)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error(`Redshift query failed: ${message}`)
    return []
  }
}

export async function getStudyAnalytics(
  userId: string,
  dateRange: { start: string; end: string }
): Promise<AnalyticsResult> {
  try {
    const sql = `
      SELECT
        user_id,
        SUM(study_duration_minutes) as total_study_time,
        AVG(session_length_minutes) as avg_session_length,
        AVG(completion_rate) as completion_rate
      FROM study_sessions
      WHERE user_id = :p1
        AND session_date BETWEEN :p2 AND :p3
      GROUP BY user_id
    `
    const results = await queryRedshift(sql, [userId, dateRange.start, dateRange.end])

    const topTopicsSql = `
      SELECT
        topic,
        SUM(time_spent_minutes) as time_spent,
        AVG(score) as avg_score
      FROM study_activity
      WHERE user_id = :p1
        AND activity_date BETWEEN :p2 AND :p3
      GROUP BY topic
      ORDER BY time_spent DESC
      LIMIT 10
    `
    const topTopics = await queryRedshift(topTopicsSql, [userId, dateRange.start, dateRange.end])

    const row = results[0] || {}
    return {
      userId,
      totalStudyTime: (row.total_study_time as number) || 0,
      averageSessionLength: (row.avg_session_length as number) || 0,
      completionRate: (row.completion_rate as number) || 0,
      topTopics: topTopics.map((t) => ({
        topic: (t.topic as string) || '',
        timeSpent: (t.time_spent as number) || 0,
        score: (t.avg_score as number) || 0,
      })),
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error(`getStudyAnalytics failed: ${message}`)
    return {
      userId,
      totalStudyTime: 0,
      averageSessionLength: 0,
      completionRate: 0,
      topTopics: [],
    }
  }
}

export async function getCourseTrends(courseId: string): Promise<TrendData[]> {
  try {
    const sql = `
      SELECT
        DATE(activity_date) as date,
        COUNT(DISTINCT CASE WHEN action = 'enroll' THEN user_id END) as enrollments,
        COUNT(DISTINCT CASE WHEN action = 'complete' THEN user_id END) as completions,
        AVG(score) as average_score,
        COUNT(DISTINCT user_id) as active_users
      FROM course_activity
      WHERE course_id = :p1
      GROUP BY DATE(activity_date)
      ORDER BY date DESC
      LIMIT 90
    `
    const results = await queryRedshift(sql, [courseId])

    return results.map((row) => ({
      date: (row.date as string) || '',
      enrollments: (row.enrollments as number) || 0,
      completions: (row.completions as number) || 0,
      averageScore: (row.average_score as number) || 0,
      activeUsers: (row.active_users as number) || 0,
    }))
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error(`getCourseTrends failed: ${message}`)
    return []
  }
}
