FROM node:24-alpine AS base
RUN corepack enable
WORKDIR /repo
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY apps/web/package.json ./apps/web/
COPY packages/bio/package.json ./packages/bio/
COPY packages/config/package.json ./packages/config/
COPY packages/contracts/package.json ./packages/contracts/
COPY packages/logger/package.json ./packages/logger/
COPY packages/sentry/package.json ./packages/sentry/
RUN pnpm install
COPY biome.json ./
COPY packages ./packages
COPY apps/web ./apps/web

FROM base AS dev

FROM base AS build
RUN pnpm --filter @virtool/web build

FROM node:24-alpine AS dist
WORKDIR /ui
COPY --from=build /repo/apps/web/dist ./dist
COPY --from=build /repo/apps/web/scripts ./scripts
COPY --from=build /repo/apps/web/package.json ./
RUN npm install --omit=dev semver sirv
EXPOSE 9900
ENV VT_UI_HOST="0.0.0.0"
ENV VT_UI_PORT="9900"
CMD ["npm", "start"]
