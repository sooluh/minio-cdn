FROM oven/bun:1.1 AS install
WORKDIR /usr/src/app

RUN mkdir -p /tmp/install
COPY package.json bun.lockb /tmp/install
RUN cd /tmp/install && bun install --frozen-lockfile --production

FROM oven/bun:1.1-distroless
WORKDIR /usr/src/app

COPY --from=install /tmp/install/node_modules node_modules
COPY src src
COPY static static

ENV NODE_ENV production
EXPOSE 3000/tcp

HEALTHCHECK --interval=5s --timeout=10s --retries=3 CMD ["/usr/local/bin/bun", "src/healthcheck.ts"]
CMD ["src/app.ts"]
