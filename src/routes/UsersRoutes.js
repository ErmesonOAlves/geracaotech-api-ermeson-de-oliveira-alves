import express from 'express';
const router = express.Router();
import {authenticationMiddleware} from '../middlewares/authenticationMiddleware.js'
import {getById,create,update,remove,login,search} from '../controllers/UserController.js'
router.get('/v1/user/search',search)
router.get('/v1/user/:id', authenticationMiddleware,getById);
router.post('/v1/user', create);
router.post('/v1/user/token',login)
router.put('/v1/user/:id',authenticationMiddleware, update);
router.delete('/v1/user/:id', authenticationMiddleware, remove);
export default router;