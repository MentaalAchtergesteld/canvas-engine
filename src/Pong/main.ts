import { Engine } from "../Engine/Engine";
import { GameScene } from "./Scenes/GameScene";
import { MainScreenScene } from "./Scenes/MainScreenScene";

async function loadFonts() {
  const PressStart2P = await new FontFace(
    "PressStart2P",
    "url(https://fonts.gstatic.com/s/pressstart2p/v15/e3t4euO8T-267oIAQAu6jDQyK3nVivM.woff2) format('woff2')"
  ).load();

  document.fonts.add(PressStart2P);

  await document.fonts.ready;
}

const CANVAS_WIDTH = 1024;
const CANVAS_HEIGHT = 768;

export async function setupEngine() {
  await loadFonts();

  const engine = new Engine("canvasParent", CANVAS_WIDTH, CANVAS_HEIGHT);

  const soundManager = engine.soundManager;
  soundManager.addSound("ballHit", "./assets/hit_sfx.mp3");

  const sceneManager = engine.sceneManager;

  sceneManager.addScene("Game", GameScene(engine, CANVAS_WIDTH, CANVAS_HEIGHT));
  sceneManager.addScene(
    "MainScreen",
    MainScreenScene(engine, CANVAS_WIDTH, CANVAS_HEIGHT)
  );
  sceneManager.switchScene("MainScreen");

  engine.start();
}
