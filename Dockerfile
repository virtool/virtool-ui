FROM library/node:16-buster as npm
WORKDIR /build
COPY package.json package-lock.json tsconfig.json /build/
RUN npm i

FROM library/node:16-buster as dev
WORKDIR /build
COPY --from=npm /build/node_modules /build/node_modules
COPY package.json package-lock.json vite.config.js /build/
COPY server /build/server
COPY src /build/src
CMD ["npx", "vite", "serve"]

FROM library/node:16-buster as build
WORKDIR /build
COPY --from=npm /build/node_modules /build/node_modules
COPY vite.config.js ./
COPY src /build/src
RUN npx vite build

FROM library/node:16-buster as dist
WORKDIR /ui
COPY --from=build /build/dist /ui/dist
COPY --from=npm /build/package.json /ui/
RUN npm install commander express superagent semver
COPY run.js /ui/
COPY ./server /ui/server
EXPOSE 9900
ENV VT_UI_HOST="0.0.0.0"
ENTRYPOINT ["node", "run"]
