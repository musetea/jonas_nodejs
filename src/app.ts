import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import path from "path";
import errorController from "./controllers/errorController";
import HttpError from "./utils/HttpError";
import userRouter from "./routes/userRoutes";
import tourRouter from "./routes/tourRoutes";
import { IUserModel } from "./models/user";

interface IRequest extends Request {
	requestTime?: string;
	user?: IUserModel;
}

const app = express();

// 1) 미들웨어 (로깅)
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}
// 파서설정
app.use(express.json());
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
