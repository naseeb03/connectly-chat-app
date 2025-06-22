import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import dotenv from 'dotenv';

const app = express();
const server = http.createServer(app);
dotenv.config();

// Configure CORS for socket.io to allow both development and production origins
const allowedOrigins = [
    'http://localhost:5173', // Vite dev server
    'http://localhost:3000', // Alternative dev port
    process.env.CLIENT_URL   // Production URL
].filter(Boolean); // Remove undefined values

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        credentials: true
    },
});

const userSocketMap = [];

export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}

io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    const userId = socket.handshake.query.userId;
    if(userId)
        userSocketMap[userId] = socket.id;

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    
    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
})

export { io, app, server };