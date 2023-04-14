import rateLimit from "express-rate-limit";

const limitMs = 15 * 60 * 1000; // 15 minutes
const msg = `"Too Many requests from this IP, please try again in an 15 minute"`;
const max = 100;

const limiter = rateLimit({
	windowMs: limitMs,
	max: max, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	message: msg,
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

export default limiter;
