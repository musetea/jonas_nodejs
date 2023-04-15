import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import path from "path";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
// import xss from "xss";
// import xss from "xss-clean";
import hpp from "hpp";
import errorController from "./controllers/errorController";
import HttpError from "./utils/HttpError";
import { IUserModel } from "./models/user";
import limiter from "./utils/lateLimiter";

//  라우트
import userRouter from "./routes/userRoutes";
import tourRouter from "./routes/tourRoutes";
import reviewRouter from "./routes/reviewRoutes";

interface IRequest extends Request {
	requestTime?: string;
	user?: IUserModel;
}

const app = express();

// 0)
app.use(helmet());

// 1) 미들웨어 (로깅)
// console.log(process.env);
if (process.env.NODE_ENV === "developement") {
	app.use(morgan("dev"));
}
app.use("/api", limiter);

// 파서설정
app.use(
	express.json({
		limit: "10kb",
	})
);
// NoSQL Query Injection
app.use(mongoSanitize());
// XSS
// app.use(xss());
app.use(hpp());

const staticDir = path.resolve(__dirname, "../public");
app.use(express.static(staticDir));

// 2) 미들웨어 (시간설정)
app.use((req: IRequest, res: Response, next: NextFunction) => {
	req.requestTime = new Date().toISOString();
	next();
});

// 라우츠
app.use("/api/v1/user", userRouter);
app.use("/api/v1/tour", tourRouter);
app.use("/api/v1/review", reviewRouter);

app.use("*", (req, res, next) => {
	const err = new HttpError(
		`Con't find (${req.originalUrl}) on this server!`,
		404
	);
	next(err);
});

// 에러 라우팅
app.use(errorController);

export default app;
