# virtool-ui
The browser frontend for Virtool

**Installation guide for development of virtool-ui:**

Dependencies:
- Docker (required)
- Node.js (required)
- git (suggested)

Installation: 

1. Clone the repository onto your local machine
    - Ex: `git clone https://github.com/virtool/virtool-ui.git .`
3. Change directories to the root directory of virtool-ui repository.
2. Install frontend dependencies listed in package.lock with npm
    - Ex: `npm install`

Startup:
1.  Start the backend by running: `docker-compose -f ./docker-compose.dev.yml up`
    - **_NB:_** Docker compose file is configured for development **only**
    - _Optional_: add `-d` tag to run the backend in the background
    - _Note:_ may require user permission configuration
2. Start either the development server or the production server:
    - Development server: (with HMR) run `npm run startDev`
      - _Note:_ development server runs on `localhost:3000` and assumes the backend is listening at `localhost:9950` 
      - _Note:_ use when hot reloading is more important than simulating production CSP and networking
    - Production server: run `npm run start`
      - _NB:_ for running the production server `port` and `backend-url` must be specified, this can be done by command line or by setting environmental variables.
      - _Config:_ to set `port` and `backend-url` by environmental variables set `VTUI_PORT` and `VTUI_BACKEND_URL` respectively.
        - _Ex:_ `export VTUI_PORT=3000 VTUI_BACKEND_URL=http://localhost:9950`
        - Alternatively the server can be run without setting environmental varaibles by starting the server by passing values for `port` and `backend-url`   
          - _Ex:_ `npm run start -- --port=3000 --backend-url=http://localhost:9950` 

**Installation via docker compose:** (Static image of virtool-ui, not for virtool-ui development )
  - Insert the following code into your docker compose file:
<pre><code>a simple
  ui:  
    image: virtool/ui
    environment:  
      VTUI_PORT: 3000  #Sets the port that the development server will bind to, change as needed.
      VTUI_BACKEND_URL: http://host.docker.internal:9950  #Sets the URL the frontend server will proxy API and websocket requests to, change as needed
    ports:  
      - "3000:3000"  #sets the ports that docker will expose, change as needed, should match the value for VTUI_PORT
    extra_hosts:  
      - "host.docker.internal:host-gateway" 
</code></pre>



  - Run `docker-compose -f ./path/to/your/docker-compose/file up`
    
 
