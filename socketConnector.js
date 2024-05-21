import { io } from "socket.io-client";

export const socket = io('http://192.168.1.190:5000');  // Adjust the URL as needed