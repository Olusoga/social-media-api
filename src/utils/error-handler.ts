export class HttpError extends Error {
    statusCode: number;
  
    constructor(statusCode: number, message: string) {
      super(message);
      this.statusCode = statusCode;
      Object.setPrototypeOf(this, HttpError.prototype); 
    }
  }
  
  export const handleError = (statusCode: number, message: string): HttpError => {
    return new HttpError(statusCode, message);
  };
  
 export const isHttpError = (error: any): error is HttpError => {
    return error instanceof HttpError;
  };
