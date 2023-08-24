
 import io from "socket.io-client/dist/socket.io";
let socket;
export const initiateSocket = () => {
    socket = io.connect("http://localhost:1000/client");
    socket.on('connect', () => {
        console.log('Connected to the server.');
    });
}
export const getSocket = () => {
    if (!socket) {
        console.error("Socket not initialized. Call initiateSocket first.");
        return null;
    }
    return socket;
};
//when user logs out
export const disconnectSocket = () => {
    if (socket) {
      socket.disconnect();
    }
  };