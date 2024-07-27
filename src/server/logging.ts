export function loggingMiddleware(req: any, res: any, next: any) {
    const time = new Date().toISOString().split(".")[0];
    console.log(`${time} - ${req.ip} - ${req.method} ${req.path}`);
    next();
}
