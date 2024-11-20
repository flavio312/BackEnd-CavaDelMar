import express from 'express';
import { getUsua, createUser,  loginUser, deleteUserByEmail,updateUser} from '../controllers/user.controller';

const router = express.Router();

router.get('/user',getUsua);
router.post('/user',createUser);
router.post('/userlogin',loginUser)
router.delete('/user/:email',deleteUserByEmail);
router.put('/user/:id',updateUser)

export default router;