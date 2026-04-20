const HDFS_URL = process.env.HDFS_URL || 'http://localhost:9870'
const HDFS_USER = process.env.HDFS_USER || 'hadoop'

export interface FileStatus {
  pathSuffix: string
  type: 'FILE' | 'DIRECTORY'
  length: number
  owner: string
  group: string
  permission: string
  modificationTime: number
  accessTime: number
  replication: number
  blockSize: number
}

interface WebHDFSError {
  RemoteException?: {
    exception: string
    message: string
    javaClassName: string
  }
}

function buildUrl(hdfsPath: string, op: string, params: Record<string, string> = {}): string {
  const queryParams = new URLSearchParams({
    'op': op,
    'user.name': HDFS_USER,
    ...params,
  })
  return `${HDFS_URL}/webhdfs/v1${hdfsPath}?${queryParams.toString()}`
}

async function handleResponse(response: Response, operation: string): Promise<void> {
  if (!response.ok) {
    let errorMessage = `HDFS ${operation} failed with status ${response.status}`
    try {
      const body: WebHDFSError = await response.json()
      if (body.RemoteException) {
        errorMessage = `HDFS ${operation} failed: ${body.RemoteException.message}`
      }
    } catch {
      // Could not parse error body
    }
    throw new Error(errorMessage)
  }
}

export async function writeToHDFS(path: string, data: Blob | string): Promise<void> {
  try {
    // Step 1: Create file (get redirect location)
    const createUrl = buildUrl(path, 'CREATE', { overwrite: 'true' })
    const createResponse = await fetch(createUrl, {
      method: 'PUT',
      redirect: 'manual',
    })

    // Step 2: Follow redirect and write data
    const dataNodeUrl = createResponse.headers.get('Location')
    if (!dataNodeUrl) {
      // Some WebHDFS configs don't redirect; write directly
      const directResponse = await fetch(createUrl, {
        method: 'PUT',
        body: data,
        headers: { 'Content-Type': 'application/octet-stream' },
      })
      await handleResponse(directResponse, 'WRITE')
      return
    }

    const writeResponse = await fetch(dataNodeUrl, {
      method: 'PUT',
      body: data,
      headers: { 'Content-Type': 'application/octet-stream' },
    })
    await handleResponse(writeResponse, 'WRITE')
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('HDFS')) {
      throw error
    }
    const message = error instanceof Error ? error.message : 'Unknown error'
    throw new Error(`HDFS write failed: ${message}`)
  }
}

export async function readFromHDFS(path: string): Promise<Buffer> {
  try {
    const url = buildUrl(path, 'OPEN')
    const response = await fetch(url)
    await handleResponse(response, 'READ')

    const arrayBuffer = await response.arrayBuffer()
    return Buffer.from(arrayBuffer)
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('HDFS')) {
      throw error
    }
    const message = error instanceof Error ? error.message : 'Unknown error'
    throw new Error(`HDFS read failed: ${message}`)
  }
}

export async function listHDFSDirectory(path: string): Promise<FileStatus[]> {
  try {
    const url = buildUrl(path, 'LISTSTATUS')
    const response = await fetch(url)
    await handleResponse(response, 'LIST')

    const body = await response.json()
    return body.FileStatuses?.FileStatus || []
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('HDFS')) {
      throw error
    }
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error(`HDFS list failed: ${message}`)
    return []
  }
}

export async function deleteFromHDFS(path: string, recursive: boolean = false): Promise<void> {
  try {
    const url = buildUrl(path, 'DELETE', { recursive: String(recursive) })
    const response = await fetch(url, { method: 'DELETE' })
    await handleResponse(response, 'DELETE')
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('HDFS')) {
      throw error
    }
    const message = error instanceof Error ? error.message : 'Unknown error'
    throw new Error(`HDFS delete failed: ${message}`)
  }
}
