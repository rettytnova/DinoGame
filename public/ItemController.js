import Item from "./Item.js";
import itemUnlocks from './assets/item_unlock.json' with { type: "json" };

class ItemController {

    INTERVAL_MIN = 0;
    INTERVAL_MAX = 3000;

    nextInterval = null;
    itemArr = [];

    unlockedIndex = 0;

    constructor(ctx, itemImages, scaleRatio, speed) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.itemImages = itemImages;
        this.scaleRatio = scaleRatio;
        this.speed = speed;

        this.setNextItemTime();
    }    

    setNextItemTime() {
        this.nextInterval = this.getRandomNumber(
            this.INTERVAL_MIN,
            this.INTERVAL_MAX
        );
    }
    //min부터 max까지의 숫자중 랜덤 숫자를 뽑음
    getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    createItem(stage) {
        //const index = this.getRandomNumber(0, this.itemImages.length - 1); 
        const data = itemUnlocks.data;
        let maxUnlockedIndex = 0;
        if(stage < 11) {
            maxUnlockedIndex = data.findIndex((e) => e.stageLevel > stage) - 1;
        } else {
            maxUnlockedIndex = data.length - 1;
        }
        if(this.unlockedIndex < maxUnlockedIndex){
            this.unlockedIndex = maxUnlockedIndex;
            console.log(`새로운 아이템이 해금되었습니다 : ${this.unlockedIndex + 1}번 포켓볼`);
        }
        const index = this.getRandomNumber(0, maxUnlockedIndex);
        const itemInfo = this.itemImages[index];
        const x = this.canvas.width * 1.5;
        const y = this.getRandomNumber(
            10,
            this.canvas.height - itemInfo.height
        );

        const item = new Item(
            this.ctx,
            itemInfo.id,
            x,
            y,
            itemInfo.width,
            itemInfo.height,
            itemInfo.image
        );

        this.itemArr.push(item);
    }


    update(gameSpeed, deltaTime, stage) {
        if(this.nextInterval <= 0) {
            this.createItem(stage);
            this.setNextItemTime();
        }

        this.nextInterval -= deltaTime;

        this.itemArr.forEach((item) => {
            item.update(this.speed, gameSpeed, deltaTime, this.scaleRatio);
        })

        this.itemArr = this.itemArr.filter(item => item.x > -item.width);
    }

    draw() {
        this.itemArr.forEach((item) => item.draw());
    }

    collideWith(sprite) {
        const collidedItem = this.itemArr.find(item => item.collideWith(sprite))
        if (collidedItem) {
            this.ctx.clearRect(collidedItem.x, collidedItem.y, collidedItem.width, collidedItem.height)
            return {
                itemId: collidedItem.id
            }
        }
    }

    reset() {
        this.itemArr = [];
    }
}

export default ItemController;