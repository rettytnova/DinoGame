import express from 'express';
import { createServer } from 'http';
import initSocket from './init/socket.js';
import { loadGameAssets } from './init/assets.js';

const app = express();
const server = createServer(app);

const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false })); // url 읽는 노드js 쿼리스트링
app.use(express.static('public')); // public디렉토리의 정적파일 실행
initSocket(server); //

app.get('/', (req, res, next) => {
    res.send('Hello world!');
});

server.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);

    // read files
    try {
        const assets = await loadGameAssets();
        //console.log(assets);
        console.log('loaded successfully');
    } catch (e) {
        console.error('failed to load gameAssets', e);
    }
});
