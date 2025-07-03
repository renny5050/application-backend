import express from 'express';
import {
    createItem,
    getAllItems,
    getItemById,
    updateItem,
    deleteItem
} from '../controllers/items.controller.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
const router = express.Router();


router.post('/api/item', authenticate, authorize([1]), createItem);
router.get('/api/item', authenticate, authorize([1]), getAllItems);
router.get('/api/item/:id', authenticate, authorize([1]), getItemById);
router.put('/api/item/:id', authenticate, authorize([1]), updateItem);
router.delete('/api/item/:id', authenticate, authorize([1]), deleteItem);

export default router;