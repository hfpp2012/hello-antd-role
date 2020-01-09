class HttpException extends Error {
  status: number;
  message: string;
  errors?: any;

  constructor(status: number, message: string, errors?: any) {
    super(message);
    this.status = status;
    this.message = message;
    this.errors = errors;
  }
}

export default HttpException;
