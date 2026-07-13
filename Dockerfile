FROM node:24-alpine AS base
RUN corepack enable
WORKDIR /repo
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY apps/web/package.json ./apps/web/
COPY packages/bio/package.json ./packages/bio/
COPY packages/contracts/package.json ./packages/contracts/
COPY packages/logger/package.json ./packages/logger/
COPY packages/sentry/package.json ./packages/sentry/
RUN pnpm install --frozen-lockfile
COPY biome.json ./
COPY packages ./packages
COPY apps/web ./apps/web

FROM base AS dev

FROM base AS build
RUN pnpm --filter @virtool/web build

FROM node:24-alpine AS dist
WORKDIR /ui
COPY --from=build /repo/apps/web/.output ./.output
COPY --from=build /repo/apps/web/scripts ./scripts
COPY --from=build /repo/apps/web/package.json ./package.json
EXPOSE 9900
ENV HOST="0.0.0.0"
ENV PORT="9900"
CMD ["npm", "start"]
