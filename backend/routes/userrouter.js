import express from 'express';
import { createUser, deleteTourist, loginUser, updateTourist } from '../controllers/usercontroller.js';

const userRouter = express.Router();

userRouter.post('/register', createUser)
userRouter.post('/login', loginUser)
userRouter.put('/:email',updateTourist)
userRouter.delete('/:email',deleteTourist);
export default userRouter;