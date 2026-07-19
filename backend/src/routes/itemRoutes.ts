import express from 'express';
import {
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
} from '../controllers/itemController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.route('/').get(getItems).post(createItem);
router.route('/:id').get(getItem).put(updateItem).delete(deleteItem);

export default router;
