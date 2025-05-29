import express from 'express';
import {
    createItem,
    getAllItems,
    getItemById,
    updateItem,
    deleteItem
} from '../controllers/items.controller.js';

const router = express.Router();


router.post('/api/item', createItem);
router.get('/api/item', getAllItems);
router.get('/api/item/:id', getItemById);
router.put('/api/item/:id', updateItem);
router.delete('/api/item/:id', deleteItem);

export default router;