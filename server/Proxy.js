const { createProxyMiddleware } = require("http-proxy-middleware");

/**
 * Return instance of proxy middleware which redirect all /api and /ws route calls to "BackendURL"
 *
 * @func
 * @returns {function}
 */
exports.backendProxy = (backendURL) =>
  createProxyMiddleware(["/api", "/ws"], {
    target: backendURL,
    ws: true,
  });
