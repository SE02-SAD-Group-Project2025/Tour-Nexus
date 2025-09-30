import express from 'express';
import { createUser, deleteTourist, loginUser, updateTourist } from '../controllers/usercontroller.js';

const userRouter = express.Router();

userRouter.post('/register', createUser)
userRouter.post('/login', loginUser)
userRouter.put('/:email',updateTourist)
userRouter.delete('/:email',deleteTourist);
userRouter.get('/view-all-users', view_all_users);
userRouter.get('/view-user-by-email/:email', viewDetails);


export default userRouter;