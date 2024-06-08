import { io } from "socket.io-client";
const IP_ADDRESS = 'http://10.100.102.57:5000'
export const socket = io(IP_ADDRESS);  // Adjust the URL as needed