exports.logging = (req, res, next) => {
    const time = new Date().toISOString().split(".")[0];
    console.log(`${time} - ${req.ip} - ${req.method} ${req.path}`);
    next();
};
