import { io } from "socket.io-client";
export const IP_ADDRESS = 'http://10.100.102.80:5000'
export let socket = io(IP_ADDRESS);  // Adjust the URL as needed

export function changeSocket(newIp) {
    const newSocket = io(newIp);
    socket = newSocket
}