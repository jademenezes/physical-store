import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/appError';

const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  //improve error log with winston
  console.log(err);

  const statusCode = Number(err.statusCode) || 500;
  const message = err.message || 'Erro interno do servidor.';

  //Mandar erro
  res.status(statusCode).json({
    status: `${err.status}`,
    message,
  });
};

export default errorHandler;
