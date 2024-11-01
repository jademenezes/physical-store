import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/appError';

const handleDuplicateField = (err: any) => {
  const message = 'Já existe uma loja com esse endereço!';
  const statusCode = 400;
  console.log(err);

  return new AppError(message, statusCode);
};

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  //improve error log with winston
  // console.log(err);

  // if (err.code === 11000) {
  //   // MongoDB duplicate key error code
  //   console.log(err);
  //   res.status(400).json({
  //     status: 'error',
  //     message: 'Já existe uma loja neste endereço!',
  //   });
  // } else {
  //Handling generics
  const statusCode = Number(err.statusCode) || 500;
  const message = err.message || 'Erro interno do servidor.';

  //Mandar erro
  res.status(statusCode).json({
    status: `${err.status}`,
    message,
  });
};

export default errorHandler;
