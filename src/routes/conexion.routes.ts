import express from 'express';
import { createAdm, getAdms } from '../controllers/adm.controller';
import { createPeces, getPeces } from '../controllers/peces.controller';
import { createSales, getSales } from '../controllers/sales.controller';
import { createTanque, getTanque } from '../controllers/tanque.controller';
import { getUsua,createUser, loginUser } from '../controllers/user.controller';

const router = express.Router();

router.get('/adm', getAdms);
router.get('/peces', getPeces);
router.get('/sales', getSales);
router.get('/tanque', getTanque);
router.get('/user', getUsua);

router.post('/adm', createAdm);
router.post('/user', createUser);
router.post('/peces',createPeces);
router.post('/sales', createSales);
router.post('/tanque', createTanque);

export default router;
