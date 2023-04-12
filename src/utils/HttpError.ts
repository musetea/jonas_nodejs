export default class HttpError extends Error {
	private _statusCode: number;
	private _status: string;
	private _isOperational: boolean = true;
	constructor(message: string, statusCode: number) {
		super(message);

		this._statusCode = statusCode;
		this._status = String(this.statusCode).startsWith("4") ? "fail" : "error";
		this._isOperational = true;
		Error.captureStackTrace(this, this.constructor);
	}

	public get statusCode() {
		return this._statusCode;
	}
	public set statusCode(code: number) {
		this._statusCode = code;
	}

	public get status() {
		return this._status;
	}

	public get isOperational() {
		return this._isOperational;
	}
}
