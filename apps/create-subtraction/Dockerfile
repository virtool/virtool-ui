# syntax=docker/dockerfile:1-labs
#
# The create-subtraction workflow image, built from the **repo root**:
#
#     docker build -f apps/create-subtraction/Dockerfile .
#
# It has its own Dockerfile rather than a stage in the repo-root one because it
# copies a binary from ghcr.io/virtool/tools and so has to be Debian, exactly as
# apps/nuvs and apps/pathoscope do. The root Dockerfile's shared `base` is
# Alpine.

# Mirrors the install layer in the repo-root Dockerfile rather than sharing it,
# for the reason above. `COPY --parents` needs the parser directive on line 1.
FROM node:24-bookworm-slim AS node-base
RUN corepack enable
WORKDIR /repo
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY --parents apps/*/package.json packages/*/package.json ./
RUN pnpm install --frozen-lockfile
COPY packages/tsconfig.base.json ./packages/
COPY packages/bio ./packages/bio
COPY packages/contracts ./packages/contracts
COPY packages/logger ./packages/logger
COPY packages/sentry ./packages/sentry
COPY packages/storage ./packages/storage
COPY packages/workflow ./packages/workflow
COPY apps/tsconfig.node.json ./apps/

FROM node-base AS build-workflow
COPY apps/create-subtraction ./apps/create-subtraction
RUN pnpm --filter @virtool/create-subtraction build \
    && pnpm deploy --filter @virtool/create-subtraction --prod /prod/create-subtraction

# The base is Debian, and that is settled rather than a choice. The runtime
# copies seqkit from ghcr.io/virtool/tools, which is built against
# python:3.13-bookworm; musl cannot load it.
FROM node:24-bookworm-slim AS create-subtraction
WORKDIR /workflow

# seqkit is a static Go binary and needs no runtime packages of its own, which
# is why there is no apt-get layer here. Adding a tool that is not static means
# adding one.
#
# The version is pinned to what Python's workflow-create-subtraction runs: both
# implementations must report the same `gc` and `count` for the same genome
# until the cutover completes.
COPY --from=ghcr.io/virtool/tools:1.3.0 /tools/seqkit/2.13.0/seqkit /usr/local/bin/

# There is deliberately no pigz and no bowtie2. Python shells out to pigz for
# every compression; `@virtool/workflow`'s gzip helper is `node:zlib`
# in-process, and this workflow only ever compresses an upload that arrived
# uncompressed. bowtie2 belongs to the `build_index` step, which is not ported.
COPY --from=build-workflow /prod/create-subtraction ./

# Exec form, and `node` directly rather than `npm start`: npm does not forward
# signals to the process it spawns (npm/rfcs#829, still open), so SIGTERM would
# never reach the run's handler and a drained node would SIGKILL a job mid-step
# instead of reporting 124.
CMD ["node", "dist/index.mjs"]
