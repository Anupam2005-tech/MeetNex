import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export async function createSocket(token: string) {
    if (socket?.connect) return socket

    socket?.disconnect()

    socket = io(import.meta.env.VITE_BACKEND_URL, {
        auth: { token },
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
    })
    socket.on("connect_error", (err) => {
        console.error("Socket auth failed:", err.message);
    });

    return socket
}

export function getSocket() {
    return socket;
}

export function disconnectSocket() {
    socket?.disconnect();
    socket = null;
}