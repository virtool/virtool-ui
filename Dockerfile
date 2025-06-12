FROM node:22-alpine AS base
WORKDIR /build
COPY package.json package-lock.json tailwind.config.js tsconfig.json vite.config.js ./
RUN npm i
COPY src /build/src/

FROM base AS dev
WORKDIR /build

FROM base AS build
WORKDIR /build
RUN npx vite build

FROM node:22-alpine AS dist
WORKDIR /ui
COPY --from=build /build/dist ./dist
COPY --from=build /build/package.json ./
RUN npm install commander express superagent semver
COPY src/server/ ./src/server
EXPOSE 9900
ENV VT_UI_HOST="0.0.0.0"
ENTRYPOINT ["node", "run"]
