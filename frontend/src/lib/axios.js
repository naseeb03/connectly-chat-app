import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || (import.meta.env.MODE === "development" ? 'http://localhost:3000' : "/api"),
    withCredentials: true,
})