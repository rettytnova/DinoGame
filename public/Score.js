import { sendEvent } from './Socket.js';
import stages from './assets/stage.json' with { type: "json" };
import items from './assets/item.json' with { type: "json" };

class Score {
    score = 0;
    HIGH_SCORE_KEY = 'highScore';
    stage = 0;
    
    constructor(ctx, scaleRatio) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.scaleRatio = scaleRatio;        
    }

    update(deltaTime) {
      //델타타임 : 프레임하나가 렌더링 될 때의 시간
      //FPS 60 기준 1초에 deltaTime이 60 늘어남
        this.score += deltaTime * 0.02 * stages.data[this.stage].scorePerSecond;
        const data = stages.data[this.stage];
        const stageLength = stages.data.length;
        // 주의: this.stage로 현재 스테이지가 바뀌었는지 확인을 하지 않으면
        // 10.02초일때도 sendEvent를 보내고, 10.03초일때도 sendEvent를 보내는 등의 버그가 날 수 있음
        if (this.stage < stageLength - 1 && Math.floor(this.score) >= data.totalScore &&
            this.stage + 1 === data.level) {
            sendEvent(11, { currentStage: data.level, targetStage: data.level + 1});
            this.stage++;
        }
    }
    
    checkStage() {
        return this.stage + 1;
    }

    // 아이템 획득시 점수 획득
    getItem(itemId) {          
        for(let i = 0; i < items.data.length; i++){
            if(items.data[i].id === itemId){
                this.score += items.data[i].score;
                console.log(`점수 갱신: +${items.data[i].score}점 => ${Math.floor(this.score)}점`);
                break;
            }
        }
    }

    reset() {
        this.score = 0;
        this.stage = 0;
    }

    setHighScore() {
        const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
        if (this.score > highScore) {
            localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
        }
    }

    getScore() {
        return this.score;
    }

    draw() {
        const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
        const y = 20 * this.scaleRatio;

        const fontSize = 20 * this.scaleRatio;
        this.ctx.font = `${fontSize}px serif`;
        this.ctx.fillStyle = '#525250';

        const scoreX = this.canvas.width - 75 * this.scaleRatio;
        const highScoreX = scoreX - 125 * this.scaleRatio;

        const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
        const highScorePadded = highScore.toString().padStart(6, 0);

        this.ctx.fillText(scorePadded, scoreX, y);
        this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);
    }
}

export default Score;
