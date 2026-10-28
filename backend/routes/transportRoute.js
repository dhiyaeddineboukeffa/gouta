import express from 'express';
import { addTransport, listTransport, removeTransport } from '../controllers/transportController.js';
import adminAuth from '../middleware/adminAuth.js';

const transportRouter = express.Router();

transportRouter.post('/add', adminAuth, addTransport);
transportRouter.post('/remove', adminAuth, removeTransport);
transportRouter.get('/list', listTransport);

export default transportRouter;
