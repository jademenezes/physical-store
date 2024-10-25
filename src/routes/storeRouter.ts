import { Router } from 'express';
import {
  createStoreAsync,
  getAllStoresAsync,
  getStoresInRadius,
} from '../controllers/storeController';

const router = Router();

router.get('/', getAllStoresAsync);

router.post('/', createStoreAsync);

router.get<{ cep: string }>('/:cep', getStoresInRadius);

export default router;
