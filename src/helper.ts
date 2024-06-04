import { Readable } from 'stream'
import type { Context, Env } from 'hono'
import type { BucketItemStat, Client } from 'minio'
import type { StatusCode } from 'hono/utils/http-status'

export const serveStatic = (ctx: Context<Env, any, {}>, path: string, status: StatusCode = 200) => {
  const file = Bun.file(`./static/${path}`)

  ctx.status(status)
  ctx.header('Content-Type', file.type)

  return ctx.body(file.stream())
}

const toStream = (readable: Readable) => {
  return new ReadableStream({
    start(controller) {
      readable.on('data', (chunk) => controller.enqueue(chunk))
      readable.on('end', () => controller.close())
      readable.on('error', (err) => controller.error(err))
    },
    cancel() {
      readable.destroy()
    },
  })
}

export const getObject = async (
  minio: Client,
  bucket: string,
  object: string
): Promise<{ stat: BucketItemStat; stream: ReadableStream }> => {
  return new Promise(async (resolve, reject) => {
    try {
      const stat = await minio.statObject(bucket, object)
      const readable = await minio.getObject(bucket, object)
      const stream = toStream(readable)

      resolve({ stat, stream })
    } catch (error) {
      reject(error)
    }
  })
}
