import { Server as SocketIO } from "socket.io";
import registerHandler from "../handlers/register.handler.js";

const initSocket = (server) => {    
    const io = new SocketIO();
    io.attach(server); // 서버 연결하기

    registerHandler(io); //
}

export default initSocket;