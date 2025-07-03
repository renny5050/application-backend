import express from 'express';
import {
    createClassMessage,
    getAllClassMessages,
    getClassMessageById,
    getClassMessagesByClass,
    updateClassMessage,
    deleteClassMessage
} from '../controllers/classmessage.controllers.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
const router = express.Router();


router.post('/api/classmessage', authenticate, authorize([1,2]), createClassMessage);
router.get('/api/classmessage', authenticate, authorize([1,2]), getAllClassMessages);
router.get('/api/classmessage/:id', authenticate, authorize([1,2]), getClassMessageById);
router.put('/api/classmessage/:id', authenticate, authorize([1,2]), updateClassMessage);
router.delete('/api/classmessage/:id', authenticate, authorize([1,2]), deleteClassMessage);


router.get('/api/classmessage/class/:class_id', authenticate, authorize([1,2,3]), getClassMessagesByClass);


export default router;