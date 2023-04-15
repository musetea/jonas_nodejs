/**
 * JSON -> MONGODB
 */
import fs from "fs";
import path from "path";
import mongoose, { SaveOptions } from "mongoose";
import dotenv from "dotenv";
import Tour from "../src/models/tour";
import Review from "../src/models/review";
import User from "../src/models/user";

const dotEnvDir = path.join(__dirname, "../src/config.env");
dotenv.config({ path: dotEnvDir });
//console.log(process.env);

const connectionStr = `${process.env.LOCAL_DB_HOST}${process.env.LOCAL_DB}`;

mongoose.connect(connectionStr).then(() => {
	console.log(`Mongoose DB[${connectionStr}] Connection Successfully`);
});

//  Read Sample Data Json
const read = (fileDir: string) => {
	// const fileDir = path.join(__dirname, "./tours.json");
	const sampleFile = fs.readFileSync(fileDir, "utf-8");
	//console.log(sampleFile);
	const json = JSON.parse(sampleFile);
	//console.log(tours);
	return json;
};

const insert = async (fileType: string, json: any) => {
	const options: SaveOptions = {
		validateBeforeSave: false,
	};
	try {
		switch (fileType) {
			case "tours":
				await Tour.create(json);
				break;
			case "review":
				await Review.create(json);
				break;
			case "users":
				await User.create(json, options);
				break;
		}
		console.log(`${fileType}-${json.length} import end`);
	} catch (err) {
		console.log(err);
	}
	process.exit();
};
const remove = async (fileType: string) => {
	try {
		switch (fileType) {
			case "tours":
				await Tour.deleteMany();
				break;
			case "reivew":
				await Review.deleteMany();
				break;
			case "users":
				await User.deleteMany();
				break;
		}
		console.log(`${fileType} data remove`);
	} catch (err) {
		console.log(err);
	}
	process.exit();
};

const getFilePath = (fileType: string) => {
	let fileDir;
	switch (fileType) {
		case "tours":
			fileDir = path.join(__dirname, "./tours.json");
			break;
		case "review":
			fileDir = path.join(__dirname, "./review.json");
			break;
		case "users":
			fileDir = path.join(__dirname, "./users.json");
			break;
		default:
			console.log(`file type error ${fileType}`);
			break;
	}
	return fileDir;
};

const main = async () => {
	const operation = process.argv[2].replace("--", "");
	const fileType = process.argv[3].replace("--", "");

	switch (operation) {
		case "import":
			const fileDir = getFilePath(fileType);
			if (!fileDir) return;
			const jsonData = read(fileDir);
			if (jsonData) {
				insert(fileType, jsonData);
			}
			break;
		case "delete":
			await remove(fileType);
			break;
		default:
			console.log(`Operation Error ${operation}`);
			break;
	}
};

main();
