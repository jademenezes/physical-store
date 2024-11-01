import { Router } from 'express';
import {
  createStore,
  deleteStore,
  getAllStores,
  getStoresInRadius,
  updateStore,
} from '../controllers/storeController';

const router = Router();

router.route('/').get(getAllStores).post(createStore);

router.route('/:id').patch(updateStore).delete(deleteStore);

router.get('/:cep', getStoresInRadius);

export default router;
