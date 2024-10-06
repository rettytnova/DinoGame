
const stages = {};

export const createStage = (uuid) => {
    stages[uuid] = [];
}

export const getStage = (uuid) => {
    return stages[uuid];
}

export const setStage = (uuid, level, timestamp) => {
    return stages[uuid].push( { level, timestamp });
}

export const clearStage = (uuid) => {
    stages[uuid] = [];
}