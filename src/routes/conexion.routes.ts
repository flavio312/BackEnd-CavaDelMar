import express from 'express';
import { createAdm, getAdms } from '../controllers/adm.controller';
import { getPeces } from '../controllers/peces.controller';
import { getSales } from '../controllers/sales.controller';
import { getTanque } from '../controllers/tanque.controller';
import { getUsua,createUser, loginUser } from '../controllers/user.controller';

const router = express.Router();

router.get('/adm', getAdms);
router.get('/peces', getPeces);
router.get('/sales', getSales);
router.get('/tanque', getTanque);
router.get('/user', getUsua);

router.post('/adm', createAdm);
router.post('/user', createUser);


export default router;
