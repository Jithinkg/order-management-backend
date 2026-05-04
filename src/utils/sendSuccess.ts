import { Response } from 'express';

const sendSuccess = <T>(res: Response, data: T, message: string = 'Success', statusCode: number = 200): void => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

module.exports = sendSuccess;
