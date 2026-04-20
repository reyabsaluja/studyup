import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

export async function getCached<T>(key: string): Promise<T | null> {
  const data = await redis.get(key)
  return data ? JSON.parse(data) : null
}

export async function setCache(key: string, data: unknown, ttl: number = 3600): Promise<void> {
  await redis.set(key, JSON.stringify(data), 'EX', ttl)
}

export async function invalidateCache(pattern: string): Promise<void> {
  const keys = await redis.keys(pattern)
  if (keys.length > 0) await redis.del(...keys)
}

export async function getCachedOrFetch<T>(key: string, fetcher: () => Promise<T>, ttl?: number): Promise<T> {
  const cached = await getCached<T>(key)
  if (cached) return cached
  const data = await fetcher()
  await setCache(key, data, ttl)
  return data
}

export default redis
