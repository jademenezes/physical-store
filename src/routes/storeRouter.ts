import { Router } from 'express';
import {
  createStore,
  getAllStores,
  getStoresInRadius,
  updateStore,
} from '../controllers/storeController';

const router = Router();

router.route('/').get(getAllStores).post(createStore);

router.route('/:id').patch(updateStore);
router.get('/:cep', getStoresInRadius);

export default router;
