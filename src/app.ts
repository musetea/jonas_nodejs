import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import path from "path";
import errorController from "./controllers/errorController";
import HttpError from "./utils/HttpError";

const app = express();
app.use(express.json());
const staticDir = path.resolve(__dirname, "../public");
app.use(express.static(staticDir));
app.use(morgan("dev"));

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
