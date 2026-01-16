import express from 'express';
import { createUser, deleteUser, loginUser, updateUser, view_all_users, viewDetails } from '../controllers/usercontroller.js';

const userRouter = express.Router();

userRouter.post('/register', createUser)
userRouter.post('/login', loginUser)
userRouter.put('/update/:email', updateUser);
userRouter.put('/:email', updateUser);
userRouter.delete('/:email', deleteUser);
userRouter.get('/view-all-users', view_all_users);
userRouter.get('/view-user-by-email/:email', viewDetails);


export default userRouter;
