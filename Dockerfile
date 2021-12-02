FROM library/node:14-buster as build
WORKDIR /build
COPY . /build/
RUN npm i
RUN npx webpack --config webpack.production.config.babel.js

FROM library/node:14-buster
WORKDIR /ui
COPY --from=build /build/dist dist
RUN npm install commander express http-proxy-middleware
COPY run.js /ui/
COPY ./server /ui/server
EXPOSE 3000
ENTRYPOINT ["node", "run"]
