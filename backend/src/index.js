import express from 'express';
import { connectDB } from './lib/db.js';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { app, server } from './lib/socket.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Configure CORS to allow both development and production origins
const allowedOrigins = [
    'http://localhost:5173', // Vite dev server
    'http://localhost:3000', // Alternative dev port
    process.env.CLIENT_URL   // Production URL
].filter(Boolean); // Remove undefined values

app.use(express.json());
app.use(cookieParser());
app.use(cors({ 
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // Remove trailing slash for comparison
        const cleanOrigin = origin.replace(/\/$/, '');
        
        if (allowedOrigins.some(allowed => allowed.replace(/\/$/, '') === cleanOrigin)) {
            callback(null, true);
        } else {
            console.log('CORS blocked origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true 
}));

app.use("/auth", authRoutes);
app.use("/message", messageRoutes);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
})