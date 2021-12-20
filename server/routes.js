/**
 * Asynchronously returns index.html (virtool client entrypoint) as default path
 *
 * @func
 * @param req {object} the request object generated by express
 * @param res {object} the response object generated by express
 * @returns {N/A}
 */
exports.defaultPath = (sentryDsn) => (req, res) => {
  res.render("index.html", { nonce: res.locals.nonce, sentryDSN: sentryDsn });
};
