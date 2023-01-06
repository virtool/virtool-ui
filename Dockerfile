FROM library/node:16-buster as npm
WORKDIR /build
COPY package.json package-lock.json tsconfig.json /build/
RUN npm i

FROM library/node:16-buster as dev
WORKDIR /build
COPY --from=npm /build/node_modules /build/node_modules
COPY package.json package-lock.json webpack.config.js tsconfig.json .eslintrc run.js /build/
COPY server /build/server
COPY src /build/src
CMD ["npx", "webpack-dev-server"]

FROM npm as build
COPY --from=npm /build/node_modules /build/node_modules
COPY webpack.production.config.js ./
COPY src /build/src
RUN npx webpack --config webpack.production.config.js

FROM library/node:16-buster as final
WORKDIR /ui
COPY --from=build /build/dist dist
RUN npm install commander express http-proxy-middleware ejs
COPY run.js /ui/
COPY ./server /ui/server
EXPOSE 9900
ENV VT_UI_HOST="0.0.0.0"
ENTRYPOINT ["node", "run"]
