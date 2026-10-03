class AppError extends Error {
    constructor(message , statusCode, statusText) {
    super(message);
    this.statusCode = statusCode;
    this.statusText = statusText;
    this.status = statusText;
  }

  static create(message, statusCode, statusText) {
    return new AppError(message, statusCode, statusText);
  }
}

module.exports =  AppError
