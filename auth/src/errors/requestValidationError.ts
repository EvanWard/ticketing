import type { ValidationError } from "express-validator";
import CustomError from "./customError";

class RequestValidationError extends CustomError {
    statusCode = 400;

    constructor(public errors: ValidationError[]) {
        super('Invalid request parameters');

        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }

    serializeErrors() {
        return this.errors.map(error => ({
            message: error.msg,
            field: error.param,
        }));
    }
}

export default RequestValidationError;
