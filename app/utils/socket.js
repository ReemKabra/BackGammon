
 import io from "socket.io-client/dist/socket.io";
let socket;
export const initiateSocket = () => {
    socket = io.connect("http://192.168.1.33:8080");
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