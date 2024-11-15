import { Engine } from "./Engine/Engine";
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

async function setupEngine() {
  await loadFonts();

  const engine = new Engine("canvasParent", CANVAS_WIDTH, CANVAS_HEIGHT);

  const sceneManager = engine.getSceneManager();

  sceneManager.addScene("Game", GameScene(engine, CANVAS_WIDTH, CANVAS_HEIGHT));
  sceneManager.addScene(
    "MainScreen",
    MainScreenScene(engine, CANVAS_WIDTH, CANVAS_HEIGHT)
  );

  engine.getSceneManager().switchScene("MainScreen");
  engine.start();
}

setupEngine();
