import { connect } from "mongoose";
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import app from "./app";

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE?.replace(
	"<PASSWORD>",
	process.env.DATABASE_PASSWORD
);

connect(DB, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false,
})
	.then(() => {
		console.log("Mongoose DB Connection Successful!!");
	})
	.catch(err => {});

const port = process.env.PORT || 3001;

const server = app.listen(port, () => {
	console.log(`Server is running ${port}`);
});

/**
 * 처리되지 않은 예외 처리
 * 우하하게 서버 닫기
 * 비동기 예외 처리
 */
process.on("unhandledRejection", err => {
	console.log("UNHANDLER REJECTION! ❄️ Shutting down...");
	console.log(err.name, err.message);
	server.close(() => {
		process.exit(1);
	});
});

/**
 * 동기오류 예외 잡기
 */
process.on("uncaughtException", err => {
	console.log("UNCAUGHT EXCEPTION! ❄️ Shutting down...");
	console.log(err.name, err.message);
	server.close(() => {
		process.exit(1);
	});
});
