import { getGameAssets } from "../init/assets.js";
import { getStage, setStage } from "../models/stage.model.js";

export const moveStageHandler = (userId, payload) => {
    
    // 유저의 현재 스테이지정보
    let currentStages = getStage(userId);

    if(!currentStages.length){
        return { status: 'fail', message: "No stages found for user"};
    }

    // 현재 최고스테이지임을 알기 위한 오름차순 정렬
    currentStages.sort((a, b) => a.level - b.level);
    const currentStage = currentStages[currentStages.length - 1];

    // 클라이언트의 현재 스테이지와 서버의 현재 스테이지가 같은 지 비교
    if(currentStage.level !== payload.currentStage){
        return { status: "fail", message: `Stage mismatched: 클라현재레벨 ${currentStage.level} vs 서버현재레벨 ${payload.currentStage}, 서버의도레벨 ${payload.targetStage}`};
    }
 
    const serverTime = Date.now();    
    const { stages } = getGameAssets();
    //some메서드 : 조건이 하나라도 맞다면 true를 반환 
    // => payload.targetStage와 일치하는 단 하나의 stage.id라도 있다면, 
    // targetStage에 맞는 실행이 가능하므로 false를 반환시켜서 실행
    if (!stages.data.some((stage) => stage.level === payload.targetStage)){
        return { status: 'fail', message: "Target stage not found"};
    }
    
    setStage(userId, payload.targetStage, serverTime);
    return { status: `success! Stage => ${payload.targetStage}` };    
};
