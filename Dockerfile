# syntax=docker/dockerfile:1-labs

# The parser directive above is what makes `COPY --parents` available, which is
# how the install layer takes every workspace manifest by glob while preserving
# directory structure. A plain `COPY apps/*/package.json apps/` flattens them
# all onto one path. Adding a workspace must not mean editing this file.
#
# Every stage in this repo is Debian. The workflow images copy binaries from
# ghcr.io/virtool/tools, which are built against python:3.13-bookworm and
# dynamically linked against glibc, so at least one image has to be glibc — and
# one base shared by everything is worth more than the ~70 MB Alpine would save
# on the images that could do without it. Do not add an Alpine stage.
FROM node:24-bookworm-slim AS base
RUN corepack enable
WORKDIR /repo
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY --parents apps/*/package.json packages/*/package.json ./
RUN pnpm install --frozen-lockfile
COPY biome.json ./
# Copied per package rather than as a blanket `COPY packages ./packages`.
# packages/pathoscope-core is a Rust crate with no package.json — it is not a
# pnpm workspace, and a blanket copy would pull its src/ and Cargo.lock in and
# bust this layer's cache on every Rust edit. Add a line here when a new
# TypeScript package appears.
COPY packages/tsconfig.base.json ./packages/
COPY packages/bio ./packages/bio
COPY packages/contracts ./packages/contracts
COPY packages/data ./packages/data
COPY packages/logger ./packages/logger
COPY packages/sentry ./packages/sentry
COPY packages/service ./packages/service
COPY packages/storage ./packages/storage
COPY packages/workflow ./packages/workflow

# The Node-app tsconfig base every non-Vite app extends. A fixed path, so it
# needs no edit when an app is added — unlike the per-workspace manifest list it
# replaced.
COPY apps/tsconfig.node.json ./apps/

# App source is copied by each build stage rather than here, so a change to one
# app does not invalidate another's cache, and so adding an app never touches
# the install layer above.

FROM base AS dev
COPY apps/web ./apps/web

FROM base AS build-web
COPY apps/web ./apps/web
# The Sentry Vite plugin uploads source maps only when SENTRY_AUTH_TOKEN is set
# at build time. Mount it as a BuildKit secret so it is available for this RUN
# only and never persists in an image layer. Absent (e.g. local builds, forked
# PRs) the upload gracefully no-ops and the build still succeeds.
RUN --mount=type=secret,id=sentry_auth_token \
    SENTRY_AUTH_TOKEN="$(cat /run/secrets/sentry_auth_token 2>/dev/null || true)" \
    pnpm --filter @virtool/web build

# Named `dist` rather than `web` because tooling outside this repo targets it.
FROM node:24-bookworm-slim AS dist
WORKDIR /ui
COPY --from=build-web /repo/apps/web/.output ./.output
COPY --from=build-web /repo/apps/web/package.json ./package.json
EXPOSE 9900
ENV HOST="0.0.0.0"
ENV PORT="9900"
CMD ["npm", "start"]

# Non-Vite apps bundle to a single `dist/index.mjs` with their workspace
# packages inlined, then `pnpm deploy` materialises the externals the bundle
# still imports — `injectWorkspacePackages: true` in pnpm-workspace.yaml is what
# lets it resolve `workspace:*` dependencies rather than refusing.

FROM base AS build-jobs-api
COPY apps/jobs-api ./apps/jobs-api
RUN pnpm --filter @virtool/jobs-api build \
    && pnpm deploy --filter @virtool/jobs-api --prod /prod/jobs-api

FROM node:24-bookworm-slim AS jobs-api
WORKDIR /jobs-api
COPY --from=build-jobs-api /prod/jobs-api ./
EXPOSE 9950
ENV VT_JOBS_API_HOST="0.0.0.0"
ENV VT_JOBS_API_PORT="9950"
# `--import @sentry/node/preload` installs Sentry's module hooks before any
# application import is evaluated. Without it the app's own static imports —
# @hono/node-server, postgres — resolve before `Sentry.init` runs in the module
# body, and neither HTTP nor database spans are ever recorded. The DSN is
# resolved from `<KEY>_FILE`-backed config, so init genuinely cannot happen any
# earlier than that; the preload hook is what makes late init safe.
CMD ["node", "--import", "@sentry/node/preload", "dist/index.mjs"]

FROM base AS build-tasks
COPY apps/tasks ./apps/tasks
RUN pnpm --filter @virtool/tasks build \
    && pnpm deploy --filter @virtool/tasks --prod /prod/tasks

# One binary carries both halves of the task system, and neither half has a flag
# to turn it off: the cutover from Python is two deployments inside a minute, and
# a minute of task lag is invisible to a user, so a staged rollout buys nothing.
FROM node:24-bookworm-slim AS tasks
WORKDIR /tasks
COPY --from=build-tasks /prod/tasks ./
EXPOSE 9900
ENV VT_TASKS_PROBE_PORT="9900"
# Exec form, and `node` directly rather than `npm start`: npm does not forward
# signals to the process it spawns (npm/rfcs#829, still open), so SIGTERM would
# never reach the shutdown sequence and every rollout would end in SIGKILL with
# claims still held. The `--import @sentry/node/preload` flag installs Sentry's
# module hooks before any application import is evaluated — the DSN comes from
# `<KEY>_FILE`-backed config and cannot be read any earlier, so late init is
# safe only because of this.
CMD ["node", "--import", "@sentry/node/preload", "dist/index.mjs"]

FROM base AS build-create-subtraction
COPY apps/create-subtraction ./apps/create-subtraction
RUN pnpm --filter @virtool/create-subtraction build \
    && pnpm deploy --filter @virtool/create-subtraction --prod /prod/create-subtraction

# This workflow runs no external tool: it decompresses the source FASTA, counts
# nucleotides and gzips the result, all in-process through `@virtool/workflow`'s
# node:zlib helpers. `build_index` is deliberately not ported — nothing consumes
# a subtraction's bowtie2 shards — so there is no `bowtie2-build` to satisfy and
# nothing to copy from the tools image.
FROM node:24-bookworm-slim AS create-subtraction
WORKDIR /workflow
COPY --from=build-create-subtraction /prod/create-subtraction ./
CMD ["node", "dist/index.mjs"]

# The pathoscope workflow, published as ghcr.io/virtool/ts-pathoscope. The Rust
# core lives in packages/pathoscope-core and is compiled here rather than
# released separately, so the binary and its only consumer share one artifact
# and one version.
FROM rust:1.97-bookworm AS chef

# libclang-dev is REQUIRED, not optional. hts-sys 2.2.x runs bindgen 0.69
# against htslib's headers for x86_64-unknown-linux-gnu; it does not fall back
# to the pre-generated bindings that ship for some targets. Dropping this
# package fails the build with "Unable to find libclang". Verified empirically
# on 2026-08-04 by building with it absent.
RUN apt-get update \
    && apt-get install -y --no-install-recommends libclang-dev \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

RUN cargo install cargo-chef --locked

WORKDIR /build

FROM chef AS planner
COPY packages/pathoscope-core .
RUN cargo chef prepare --recipe-path recipe.json

FROM chef AS builder
COPY --from=planner /build/recipe.json recipe.json

# Dependencies only. hts-sys vendors htslib's C source and compiles it with the
# cc crate — by far the most expensive step in the build, and one that changes
# essentially never. Cooking it in its own layer is what keeps a .rs edit from
# recompiling htslib.
RUN cargo chef cook --release --recipe-path recipe.json

COPY packages/pathoscope-core .
RUN cargo build --release --bin pathoscope-core

FROM base AS build-pathoscope
COPY apps/workflow-pathoscope ./apps/workflow-pathoscope
RUN pnpm --filter @virtool/workflow-pathoscope build \
    && pnpm deploy --filter @virtool/workflow-pathoscope --prod /prod/workflow-pathoscope

FROM node:24-bookworm-slim AS pathoscope
WORKDIR /workflow

# The tools binaries are built against python:3.13-bookworm, which carries more
# than this slim base does. Each package here backs a specific `ldd ... => not
# found`: perl and libgomp1 for bowtie2 (a set of Perl wrappers around the
# bowtie2-align-* binaries, compiled with OpenMP), libcurl4 and libncursesw6
# for samtools. pathoscope-core itself needs none of them — hts-sys links
# htslib statically.
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        libcurl4 \
        libgomp1 \
        libncursesw6 \
        perl \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

COPY --from=ghcr.io/virtool/tools:1.2.0 /tools/bowtie2/2.5.4/bowtie* /usr/local/bin/
COPY --from=ghcr.io/virtool/tools:1.2.0 /tools/cd-hit/4.8.1/cd-hit-est /usr/local/bin/
COPY --from=ghcr.io/virtool/tools:1.2.0 /tools/pigz/2.8/pigz /usr/local/bin/
COPY --from=ghcr.io/virtool/tools:1.2.0 /tools/samtools/1.22.1/bin/samtools /usr/local/bin/

# Exactly one binary out of the whole Rust build. It is a fifth subprocess
# beside bowtie2, bowtie2-build, cd-hit-est and samtools — never loaded into the
# Node process. There is no FFI here and adding one is out of scope by decision.
COPY --from=builder /build/target/release/pathoscope-core /usr/local/bin/

COPY --from=build-pathoscope /prod/workflow-pathoscope ./

# Exec form, and `node` directly rather than `npm start`: npm does not forward
# signals to the process it spawns (npm/rfcs#829, still open), so SIGTERM would
# never reach the run's handler and a drained node would SIGKILL a job mid-step
# instead of reporting 124.
CMD ["node", "dist/index.mjs"]
