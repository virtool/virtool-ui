FROM library/node:16-buster as build
WORKDIR /build
COPY .eslintrc /build/
COPY package.json /build/
COPY package-lock.json /build/
COPY webpack.config.ts /build/
COPY webpack.production.config.js /build/
RUN npm i
COPY src /build/src
RUN npx webpack --config webpack.production.config.js

FROM library/node:16-buster
WORKDIR /ui
COPY --from=build /build/dist dist
RUN npm install commander express http-proxy-middleware ejs
COPY run.js /ui/
COPY ./server /ui/server
EXPOSE 9900
ENV VT_UI_HOST="0.0.0.0"
ENTRYPOINT ["node", "run"]
