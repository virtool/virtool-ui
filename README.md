# virtool-ui

The web-app frontend for Virtool

## Using in Production

The default CSP configuration expects API requests to be made to the same domain as the
client is served from. The UI server and API server should be served from behind the same 
reverse proxy.

## Configuration

| Option              | Env                | Description                                    |
| ------------------- | ------------------ | ---------------------------------------------- |
| `-p`, `--port`      | `VT_UI_PORT`       | The port the UI server should listen on        |
| `-H`, `--host`      | `VT_UI_HOST`       | The host the UI server should listen on        |
| `--sentry-dsn`      | `VT_UI_SENTRY_DSN` | The DSN that sentry will send logged errors to |

## Development

### Working on `virtool-ui`

Use this guide to create your environment when you are contributing to `virtool/ui`.

1. Follow the instructions in the [`dev`](https://github.com/virtool/dev) repository's README to set up a local kubernetes cluster.

2. Clone this repository onto your local machine into the same parent folder as `dev`

   ```
   git clone https://github.com/virtool/virtool-ui.git
   ```
   
3. Start tilt with frontend editing enabled

   ```
    tilt up -- --to-edit ui
   ```

### Storybook

Storybook is used to develop and test UI components in isolation. It is also used to
document components and their use cases.


1. Start storybook

   ```
   npm run storybook
   ```

2. Depending on system configuration the address will either open automatically or the
   address must be manually entered by the user.

