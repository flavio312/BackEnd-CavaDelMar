import express from 'express';
import { createPeces, getPeces } from '../controllers/peces.controller';
import { createSales, getSales } from '../controllers/sales.controller';
import { createTanque, getTanque } from '../controllers/tanque.controller';

const router = express.Router();

router.get('/peces', getPeces);
router.get('/sales', getSales);
router.get('/tanque', getTanque);

router.post('/peces',createPeces);
router.post('/sales', createSales);
router.post('/tanque', createTanque);

export default router;
