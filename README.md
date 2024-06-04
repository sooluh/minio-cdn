# MinIO CDN

Serve S3 MinIO files like Cloudflare R2.<br>
It's very lightweight and fast, powered by [Bun](https://bun.sh).

## Requirements

- Bun `>= 1.1.x`

## Getting Started

1. Clone this repository

   ```bash
   git clone https://github.com/sooluh/minio-cdn.git
   ```

2. Move to the repository dir

   ```bash
   cd minio-cdn
   ```

3. Install dependencies

   ```bash
   bun install
   ```

4. Run it!

   ```bash
   bun src/app.ts
   ```

   Need a [watch mode](https://bun.sh/docs/runtime/hot) (hot reload) that's super fast?

   ```bash
   bun --watch src/app.ts
   ```

## Docker

1. Build image

   ```bash
   docker build -t minio-cdn .
   ```

2. Run it!

   ```bash
   docker run -d \
    -e MINIO_ROOT_USER='root' \
    -e MINIO_ROOT_PASSWORD='root' \
    -e MINIO_ENDPOINT='10.10.20.1' \
    -e MINIO_PORT='9000' \
    -e MINIO_USE_SSL='false' \
    -p 3000:3000 \
    minio-cdn
   ```
