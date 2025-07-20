import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import userRouter from './routes/userrouter.js';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import hotelRouter from './routes/hotelrouter.js';
import guideRouter from './routes/guiderouter.js';

const app = express();

app.use(cors())
app.use(bodyParser.json());

app.use((req, res, next) => {
    const tokenString = req.header('Authorization');

    if (tokenString) {
        // FIX: Add the missing space after "Bearer"
        const token = tokenString.replace("Bearer ", ""); // <-- This was the main problem!

        jwt.verify(token, "secretkey", (err, decoded) => {
            if(!err){
                req.user = decoded;
                console.log("User authenticated:", decoded); // Add this for debugging
            } else {
                console.log("Invalid token", err.message);
            }
            next();
        });
    } else {
        next();
    }
});

mongoose.connect("mongodb+srv://admin:admin456@cluster0.7wwtz2t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(()=>{
    console.log('Connected to MongoDB');
})
.catch((err)=>{
    console.error('Error connecting to MongoDB:', err);
})

app.use("/api/user",userRouter)
app.use("/api/hotel",hotelRouter)
app.use("/api/guide",guideRouter)

app.listen(3000,()=>{
    console.log('Server is running on port 3000');
})