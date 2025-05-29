import express from 'express';
import {
    createClassMessage,
    getAllClassMessages,
    getClassMessageById,
    getClassMessagesByClass,
    updateClassMessage,
    deleteClassMessage
} from '../controllers/classmessage.controllers.js';

const router = express.Router();


router.post('/api/classmessage', createClassMessage);
router.get('/api/classmessage', getAllClassMessages);
router.get('/api/classmessage/:id', getClassMessageById);
router.put('/api/classmessage/:id', updateClassMessage);
router.delete('/api/classmessage/:id', deleteClassMessage);


router.get('/api/classmessage/class/:class_id', getClassMessagesByClass);


export default router;