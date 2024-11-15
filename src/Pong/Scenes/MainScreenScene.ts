import { Engine } from "../../Engine/Engine";
import { Scene } from "../../Engine/Scene";
import { Button } from "../GameObjects/Button";

const START_BUTTON_WIDTH = 320;
const START_BUTTON_HEIGHT = 64;
const START_BUTTON_BACKGROUND_COLOR = "#FFF";
const START_BUTTON_TEXT_COLOR = "#000";
const START_BUTTON_TEXT = "Start!";
const START_BUTTON_FONT_SIZE = 32;
const START_BUTTON_FONT = "PressStart2P";

function getStartButton(canvasWidth: number, canvasHeight: number): Button {
  let button = new Button(
    (canvasWidth - START_BUTTON_WIDTH) / 2,
    (canvasHeight - START_BUTTON_HEIGHT) / 2,
    START_BUTTON_WIDTH,
    START_BUTTON_HEIGHT,
    START_BUTTON_BACKGROUND_COLOR,
    START_BUTTON_TEXT_COLOR,
    START_BUTTON_TEXT,
    START_BUTTON_FONT_SIZE,
    START_BUTTON_FONT
  );

  return button;
}

export function MainScreenScene(
  engine: Engine,
  canvasWidth: number,
  canvasHeight: number
): Scene {
  const scene = new Scene("#000");

  const startButton = getStartButton(canvasWidth, canvasHeight);

  scene.addGameObject(startButton);

  startButton.onReleaseSignal.subscribe(() => {
    engine.sceneManager.switchScene("Game");
  });

  return scene;
}
