# virtool-ui

The browser frontend for Virtool

## What's Included

- Frontend code based in React
- A Express server that serves frontend resources, CSP headers, and nonces.
- Dockerfile

## Using in Production

The default CSP configuration expects API requests to be made to the same domain as the client is served from.

| Path | Description                | Example                        |
| ---- | -------------------------- | ------------------------------ |
| /api | Should route to API server | https://app.virtool.ca/api     |
| /    | Should route to UI server  | https://app.virtool.ca/samples |

## Configuration

| Option              | Env              | Description                              |
| ------------------- | ---------------- | ---------------------------------------- |
| `-p`, `--port`      | `VT_UI_PORT`     | The port the UI server should listen on  |
| `-H`, `--host`      | `VT_UI_HOST`     | The host the UI server should listen on  |
| `-a`, `--api-url`   | `VT_UI_API_URL`  | The URL API requests should be made to   |
| `-P`, `--use-proxy` | `VT_UI_USE_PROXY` | Proxy API requests through the UI server |

### API Proxy

Use the API proxy during development to avoid CORS and CSP issues due to server the UI and API servers at two different addresses.

The proxy works by proxying requests from the client to `/api` routes to the provided `--api-url`. This satisfies the CSP because all requests are sent to the UI server address (usually `http://localhost:9900`)

**In production, use a reverse proxy like NGINX or similar solution to route requests to the appropriate service** The API proxy is not suitable for production.

## Development

### Dependencies

- Docker
- Node.js
- `git`

### Working on `virtool-ui`

Use this guide when you are contributing to `virtool/ui`.

1. Clone the repository onto your local machine

   ```
   git clone https://github.com/virtool/virtool-ui.git
   ```

2. Install packages

   ```
   npm i
   ```

3. Start backend services:

   ```
   docker-compose up -d
   ```

4. Start either the development server:
   ```
   npm run startDev
   ```

### Working with `virtool/ui` image

Use this guide when you are contributing to another Virtool service and need to stand up the UI server.

In this example, we are working on `virtool/virtool` on `localhost` and want to deploy `ui` in Docker Compose. We want `ui` to proxy
API requests to `virtool/virtool`.

Use `docker-compose` to configure a `ui` service and any other services you need (eg. workflows, databases):

```yaml
ui:
  image: virtool/ui:latest
   ports:
     - "9900:9900"
   environment:
     VT_UI_HOST: "0.0.0.0"
     VT_UI_PORT: 9900 # Default port
     VT_UI_API_URL: http://host.docker.internal:9950
     VT_UI_USE_PROXY: true
   extra_hosts:
     - "host.docker.internal:host-gateway"
```

**The service (eg. Virtool API server) running on localhost must listen on `0.0.0.0` for this to work**.
