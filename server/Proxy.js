const { createProxyMiddleware } = require("http-proxy-middleware");

const BackendURL = "http://localhost:9950";

/**
 * Return instance of proxy middleware which redirect all /api and /ws route calls to "BackendURL"
 *
 * @func
 * @returns {function}
 */
exports.backendProxy = createProxyMiddleware(["/api", "/ws"], {
  target: BackendURL,
  ws: true,
});
