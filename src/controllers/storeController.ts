import { Request, Response, NextFunction } from 'express-serve-static-core';
import Store from '../models/storeModel';

async function createStore(req: Request, res: Response, next: NextFunction) {
  const newStore = await Store.create(req.body);

  res.status(201).json({
    status: 'success',
    stores: {
      newStore,
    },
  });
}
