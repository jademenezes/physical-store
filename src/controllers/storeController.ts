import { Request, Response, NextFunction } from 'express-serve-static-core';
import Store from '../models/storeModel';
import catchAsync from '../utils/catchAsync';

async function getAllStores(req: Request, res: Response, next: NextFunction) {
  const lojas = await Store.find();

  res.status(200).json({
    status: 'success',
    lojas,
  });
}

async function createStore(req: Request, res: Response, next: NextFunction) {
  const novaLoja = await Store.create(req.body);

  res.status(201).json({
    status: 'success',
    lojas: {
      novaLoja,
    },
  });
}

export const getAllStoresAsync = catchAsync(getAllStores);
export const createStoreAsync = catchAsync(createStore);
