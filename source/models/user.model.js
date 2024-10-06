const users = [];

export const addUser = (user) => {
    users.push(user);
};

export const getUser = () => {
    return users;
};

export const removeUser = (socketId) => {
    const index = users.findIndex((user) => user.socketId === socketId);
    if(index !== -1){
        // users[index]를 users배열에서 삭제하고 삭제한 해당 값을 리턴한다.
        return users.splice(index, 1)[0];
    }
};