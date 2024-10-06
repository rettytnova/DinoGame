import { getGameAssets } from "../init/assets.js";
import { getStage, setStage, clearStage } from "../models/stage.model.js";

export const gameStart = (uuid, payload) => {

    const { stages } = getGameAssets();

    clearStage(uuid);
    setStage(uuid, stages.data[0].level, payload.timestamp);    
    console.log('Stage: ', getStage(uuid));

    return { status: 'success'};
}

export const gameEnd = (uuid, payload) => {
    const { timestamp:gameEndTime, score } = payload;
    const stages = getStage(uuid);

    if(!stages.length){
        return { status:'fail', message: "No stages found for user" };
    }

    let totalScore = 0;

    stages.forEach((stage, index) => {
        let stageEndTime;
        if(index === stages.length - 1){
            // 마지막 스테이지니까 엔드타임으로 기록
            stageEndTime = gameEndTime;
        } else {
            // 이전 스테이지 타임스태프
            stageEndTime = stages[index + 1].timestamp;
        }
        
        const stageDuration = (stageEndTime - stage.timestamp) / 1000;
        totalScore += stageDuration; // 초당 1점 => stage.json에서 키,밸류 넣어서 수정해보기
    })

    // 네트워크 지연으로 인해 클라이언트와 서버가 받아들이는 점수 오차가 5를 넘어서면
    if (Math.abs(score - totalScore) > 5) {
        return { status: "fail", message: "Score verification failed" };
    }

    return { status: 'success', message: "Game ended Successfully", score };
}