import { Hono } from 'hono'
import * as Minio from 'minio'
import { cors } from 'hono/cors'
import { getObject, serveStatic } from './helper'

if (
  !process.env.MINIO_ENDPOINT ||
  !process.env.MINIO_PORT ||
  !process.env.MINIO_ACCESS_KEY ||
  !process.env.MINIO_SECRET_KEY ||
  !process.env.MINIO_BUCKET_NAME
) {
  throw new Error('You must complete the env variables')
}

const minio = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT,
  port: Number(process.env.MINIO_PORT),
  useSSL: (process.env.MINIO_USE_SSL || 'false') === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
})
const app = new Hono()

app.use(cors())
app.notFound((ctx) => serveStatic(ctx, '404.html', 404))

app.get('*', async (ctx) => {
  const bucket = process.env.MINIO_BUCKET_NAME!
  const path = ctx.req.path.replace(/^\//, '')

  console.log(bucket, path)

  try {
    const object = await getObject(minio, bucket, path)
    const contentType = object.stat.metaData['content-type'] || 'application/octet-stream'

    if (object.stat.size === 0 && contentType === 'binary/octet-stream') {
      return ctx.notFound()
    }

    ctx.header('ETag', object.stat.etag)
    ctx.header('Content-Type', contentType)

    return ctx.body(object.stream)
  } catch (_error) {}

  return ctx.notFound()
})

const port = parseInt(process.env.PORT!) || 3000
console.log(`Running at http://localhost:${port}`)

export default { port, fetch: app.fetch }
