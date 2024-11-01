import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/appError';
import logger from './../config/logger';

//Handling erros de validação do MongoDB
const handleDuplicateField = (err: any) => {
  const message = 'Já existe uma loja com esse endereço!';
  const statusCode = 400;

  logger.warn(message, { error: err });
  return new AppError(message, statusCode);
};

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err.code === 11000) {
    err = handleDuplicateField(err);
  }

  //Logging erros
  logger.error('Erro!', {
    statusCode: Number(err.statusCode) || 500,
    message: err.message || 'Erro interno do servidor.',
  });

  const statusCode = Number(err.statusCode) || 500;
  const message = err.message || 'Erro interno do servidor.';

  //Mandar erro
  res.status(statusCode).json({
    status: `${err.status}`,
    message,
  });
};

export default errorHandler;
