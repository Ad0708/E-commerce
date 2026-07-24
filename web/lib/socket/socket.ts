import { io } from "socket.io-client";

export const socket = io("http://192.168.2.28:5000" , {
// export const socket = io("http://localhost:5000" , {
  withCredentials: true,
  autoConnect: false,
});