import { Router } from 'express';
import {
  createStoreAsync,
  getAllStoresAsync,
} from '../controllers/storeController';

const router = Router();

router.get('/', getAllStoresAsync);

router.post('/', createStoreAsync);

export default router;
