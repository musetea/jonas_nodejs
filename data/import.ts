/**
 * JSON -> MONGODB
 */
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Tour from "../src/models/tour";

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
	const tours = JSON.parse(sampleFile);
	//console.log(tours);
	return tours;
};

const insert = async (tours: any) => {
	try {
		await Tour.create(tours);
		console.log(`${tours.lenght} import end`);
	} catch (err) {
		console.log(err);
	}
	process.exit();
};
const remove = async () => {
	try {
		await Tour.deleteMany();
	} catch (err) {
		console.log(err);
	}
	process.exit();
};

switch (process.argv[2]) {
	case "--import":
		const fileDir = path.join(__dirname, "./tours.json");
		const tours = read(fileDir);
		insert(tours);
		break;
	case "--delete":
		remove();
		break;
}
