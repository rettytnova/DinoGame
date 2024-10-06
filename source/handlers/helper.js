import { CLIENT_VERSION } from '../constants.js';
import { createStage } from '../models/stage.model.js';
import { getUser, removeUser } from '../models/user.model.js';
import handlerMappings from './handlerMapping.js';

export const handleDisconnect = (socket, uuid) => {
    removeUser(socket.id);
    console.log(`User disconnected: ${socket.id}`);
    console.log('Current User:', getUser());
};

export const handleConnection = (socket, uuid) => {
    console.log(`New user connected. => ${uuid}`);
    console.log('Current users: ', getUser());

    createStage(uuid);

    socket.emit('connection', { uuid });
};

export const handleEvent = (io, socket, data) => {
    // sendEvent를 통해 data에 userId, clientVersion, handlerId, payload가 담겨있음
    if (!CLIENT_VERSION.includes(data.clientVersion)) {
        socket.emit('response', { status: 'fail', message: "Client version not found"});
        return;
    }

    const handler = handlerMappings[data.handlerId]; 
    if(!handler){
        socket.emit('response', { status: 'fail', message: "Handler not found"});
        return;
    }

    const response = handler(data.userId, data.payload); 

    if (response.broadcast){
        io.emit('response', 'broadcast');
        return;
    }

    socket.emit('response', response);
};
