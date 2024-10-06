import { addUser } from "../models/user.model.js";
import { v4 as uuidv4 } from "uuid";
import { handleConnection, handleDisconnect, handleEvent } from "./helper.js";


const registerHandler = (io) => {
    // server.on(eventName, listener)
    io.on('connection', (socket) => {
        const userUUID = uuidv4();
        // 유저 추가 (객체 배열에 유저객체 추가)
        addUser({ uuid: userUUID, socketID: socket.id });
        // 유저 정보 생성 이벤트 처리
        handleConnection(socket, userUUID);
        
        socket.on('event', (data) => handleEvent(io, socket, data));
        socket.on('disconnect', (socket) => handleDisconnect(socket, userUUID));
    });
};


export default registerHandler;
