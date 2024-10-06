// gameAssets.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 현재 파일 절대 경로 'D:/Sparta/websocket_game/source/init/assets.js'
const __filename = fileURLToPath(import.meta.url); 
// 현재 파일이 속한 폴더 경로 'D:/Sparta/websocket_game/source/init'
const __dirname = path.dirname(__filename); 
// 현재 파일이 속한 폴더 경로와 거기에 내가 원하는 경로를 합친다.
// 'D:Sparta/websocket_game/assets'
const basePath = path.join(__dirname, '../../public/assets');

let gameAssets = {};

export const readFileAsync = (basePath, filename) => {
  return new Promise((resolve, reject) => {
    // 우리가 읽을 json파일들이 assets폴더 안에 있어서
    // 그걸 읽기 위해 basePath를 지금 assets로 설정한 상태
    // basePath(assets폴더)와 그 내부의 파일이름을 합친 경로 -> 해당 파일
    // 해당파일을 utf8(읽을 수 있는 텍스트타입)으로 읽어서
    // 읽기 성공시 resolve이므로 해당 data를 JSON 형식으로 파싱하여 리턴
    // 읽기 실패시 reject이므로 err(에러)를 리턴
    fs.readFile(path.join(basePath, filename), 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(JSON.parse(data));
    });
  });
};

export const loadGameAssets = async () => {
  try {
    const [stages, items, itemUnlocks] = await Promise.all([
      readFileAsync(basePath, 'stage.json'),
      readFileAsync(basePath, 'item.json'),
      readFileAsync(basePath, 'item_unlock.json'),
    ]);
    gameAssets = { stages, items, itemUnlocks };
    return gameAssets;
  } catch (error) {
    throw new Error('Failed to load game assets: ' + error.message);
  }
};

export const getGameAssets = () => {
  return gameAssets;
};
