import { ObjectId } from "mongoose";
import { IUserModel } from "../models/user"; // <- User class
import { Request } from "express";

export interface IRequest extends Request {
    user?: {
        email: string;
        id: string;
        role: string;
    };
}
