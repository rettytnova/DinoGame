## 웹소켓 게임 만들기

접속방법 : 도메인
http://52.78.95.168:3000/

해당 프로젝트는 필수구현요소 5가지를 적용해 만들어졌습니다.
1. 스테이지구분
2. 스테이지에 따른 점수 구분
3. 스테이지에 따른 아이템 생성(해금)
4. 아이템 획득 시 점수 획득
5. 아이템 별 점수 구분

### 에셋 코드
public 폴더 디렉토리 내에 assets 폴더에 내장된 json 파일들에 정보가 적혀있습니다.
- item_unlock.json
id : 사용될 순서대로 정의되었습니다.
stageLevel : 아이템을 해금할 해당 스테이지레벨을 설정합니다.
itemId : 해금할 해당아이템의 id를 설정합니다. (id:2 일경우 id가 2번인 아이템을 해금합니다.)

- item.json
id : 해당 아이템의 id입니다. 사용될 순서대로 정의되었습니다.
score : 해당 아이템 획득 시 추가되는 점수입니다.
width : 해당 아이템이 그려질 너비입니다.
height : 해당 아이템이 그려질 높이입니다.

- stage.json
level : 해당 스테이지의 레벨로 정의되었습니다. (1스테이지, 2스테이지, ...)
totalScore : 다음 스테이지로 넘어갈 수 있는 점수 조건입니다. (레벨 1에서 총점수 100점 달성시 2스테이지로)
scorePerSecond : 해당 스테이지에서 생존으로 얻을 수 있는 틱당 점수입니다. 

### 서버 코드
- app.js
서버 메인역할 파일.
웹소켓서버를 열고 클라이언트와 서버를 연결하는 역할을 합니다.
init 폴더 내 socket.js 파일에 정의한 initSocket 함수로 서버에 Attach(연결)하여 웹소켓서버를 연결합니다.

- register.handler.js
클라이언트가 실행될 때 register.handler.js 파일에 정의되어있는 핸들러 함수에는 on 함수가 사용되어 event를 수신대기합니다.

- stage.handler.js
클라이언트와 서버가 각각 알고있는 현재 스테이지에 대한 정보를 비교해 검증하는 파일.
스테이지가 상승시 해당 스테이지가 클라이언트가 보내는 스테이지정보와 서버가 알고 있는 스테이지정보를 비교해 검증합니다.

- helper.js
각종 이벤트 요청처리를 담당하는 파일.
유저가 연결될 때 id를 부여하기 위해 event 요청 (emit)을 보내기도 합니다.

- game.handler.js
게임 전반적인 부분의 데이터를 담당하는 파일.
게임이 시작되거나 끝날 때 스테이지가 생성되거나 종료되는 등 클라이언트 외에 서버에서 실행해야 할 기능들을 처리합니다.

### 클라이언트 코드
- index.js
클라이언트 메인역할 파일.
각종 충돌(물리)처리나 여러 클라이언트 파일들의 기능 또는 클래스들이 곳에서 실행됩니다.

- Socket.js
웹소켓연결로 응답을 대기하거나 이벤트를 요청하기 위한 파일.
const socket 함수는 io함수의 인자로 받아지는 해당 도메인으로 접속되면 클라이언트를 버전에 맞게 실행하는 역할을 합니다.

- Score.js
점수처리를 담당하는 파일.

update(deltaTime) : 인자로 받는 deltaTime을 포함한 여러 기준(스테이지에 따라... 등)으로 점수를 부여하고 스테이지가 상승할 때마다 score가 스테이지가 상승하는지를 this.stage를 통해 알게하고 sendEvent함수(Socket.js 함수에 정의되어있음)를 통해 emit하여 서버에 payload를 보내 스테이지를 검증합니다.

getItem(itemId) : index.js에서 충돌처리 시 사용되는 함수로 충돌되는 itemId를 인자로 받아와 item.json파일에 정의된 객체 내 data 배열에서 해당 itemId와 함께 갖고있는 score 값을 찾아 Score 클래스가 관리하는 score를 더해줍니다.

checkStage() : this.stage는 stage.json파일에 정의된 객체의 data 배열의 index를 알기위한 값입니다.
itemController.js파일에 정의된 itemController 클래스가 알기 위한 해당 stage레벨은 index + 1부터 시작하므로 1을 더해 리턴해줍니다.

- ItemController.js
아이템 상호작용(충돌 또는 생성)시 발생할 기능을 처리하는 파일

setNextItemTime() : 아이템 생성기한을 랜덤한 범위내에서 정하기 위한 함수

getRandomNumber(min, max) : min과 max 범위 내에서 랜덤한 정수값을 반환하는 함수 (min과 max 포함)

createItem(stage) : 아이템을 생성할 때 처리해야 할 기능을 담당하는 함수
스테이지 별 해금되는 아이템의 범위와 인자로 받아온 stage를 비교해 생성할 아이템id들을 랜덤으로 선정한 후 생성합니다.
해당 클래스가 생성될 때 인자로 받아오는 값들을 생성자를 통해 정의한 상태기 때문에 갖고 있는 정보들로 아이템을 생성할 수 있습니다.

update(gameSpeed, deltaTime, stage) : 아이템 생성을 담당하는 함수
다음 아이템 생성시간을 정하고 시간이 되면 아이템을 생성한 후 다시 다음 아이템 생성시간을 정합니다.






---
추후 수정 또는 추가될 사항 : 추가적으로 구현할 기능 구현해보기 (도전과제 등)




