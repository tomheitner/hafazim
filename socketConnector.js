import { io } from "socket.io-client";
const IP_ADDRESS = 'http://192.168.63.14:5000'
export const socket = io(IP_ADDRESS);  // Adjust the URL as needed