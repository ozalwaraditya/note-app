import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import AuthRouter from './router/AuthRouter.js';
import NoteRouter from './router/NoteRouter.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

const allowedOrigin = ['https://mern-frontend-six-tan.vercel.app', 'http://localhost:5173'];

app.use(cors({ origin: allowedOrigin, credentials: true }));

//Middlewares
app.use(express.json());
app.use(cookieParser());

const connectDB = () => {
  mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("Connected to DB!")
  }).catch((err)=>{
    console.log("Error : " + err);
  })
}

//Routes
app.use('/api',AuthRouter);
app.use('/api',NoteRouter);

app.listen(process.env.PORT,()=>{
  console.log(`Server is working - ${process.env.PORT}`)
  connectDB();
})

app.use((err, req, res, next) => {
  let statusCode = err.status || 500;
  let message = err.message || "Internal Server Error";

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    statusCode = 409;
    message = `${field} already exists.`;
  }

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map(e => e.message)
      .join(", ");
  }

  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token.";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired.";
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
});

export default app;