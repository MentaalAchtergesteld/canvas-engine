import { Engine } from "../Engine/Engine";
import { Scene } from "../Engine/Scene";
import { Ball, PlaySide } from "../GameObjects/Ball";
import { DividingLine } from "../GameObjects/DividingLine";
import {
  AIPaddleController,
  Paddle,
  PlayerPaddleController,
} from "../GameObjects/Paddle";
import { ScoreKeeper } from "../GameObjects/ScoreKeeper";
import { Timer } from "../GameObjects/Timer";

const PADDLE_X_OFFSET = 24;
const PADDLE_Y_OFFSET = 16;
const PADDLE_WIDTH = 32;
const PADDLE_HEIGHT = 192;
const PADDLE_MAX_SPEED = 320;

function getPaddles(
  canvasWidth: number,
  canvasHeight: number
): [Paddle, Paddle] {
  let leftPaddleX = PADDLE_X_OFFSET;
  let rightPaddleX = canvasWidth - PADDLE_X_OFFSET - PADDLE_WIDTH;

  let paddleY = (canvasHeight - PADDLE_HEIGHT) / 2;

  let upperConstraint = PADDLE_Y_OFFSET;
  let lowerConstraint = canvasHeight - PADDLE_Y_OFFSET;

  let leftPaddle = new Paddle(
    leftPaddleX,
    paddleY,
    PADDLE_WIDTH,
    PADDLE_HEIGHT,
    upperConstraint,
    lowerConstraint,
    PADDLE_MAX_SPEED,
    new PlayerPaddleController("w", "s")
  );

  let rightPaddle = new Paddle(
    rightPaddleX,
    paddleY,
    PADDLE_WIDTH,
    PADDLE_HEIGHT,
    upperConstraint,
    lowerConstraint,
    PADDLE_MAX_SPEED,
    new PlayerPaddleController("ArrowUp", "ArrowDown")
  );

  return [leftPaddle, rightPaddle];
}

const BALL_RADIUS = 16;
const BALL_MAX_SPEED = 512;

function getBall(
  canvasWidth: number,
  canvasHeight: number,
  paddles: [Paddle, Paddle]
): Ball {
  let ballX = canvasWidth / 2;
  let ballY = canvasHeight / 2;

  let upperConstraint = 0;
  let lowerConstraint = canvasHeight;

  let leftConstraint = 0 - BALL_RADIUS * 2;
  let rightConstraint = canvasWidth + BALL_RADIUS * 2;

  let ball = new Ball(
    ballX,
    ballY,
    BALL_RADIUS,
    BALL_MAX_SPEED,
    upperConstraint,
    lowerConstraint,
    leftConstraint,
    rightConstraint,
    paddles
  );

  return ball;
}

const SCORE_KEEPER_FONT = "PressStart2P";
const SCORE_KEEPER_FONT_SIZE = 48;
const SCORE_KEEPER_Y_OFFSET = 64;
const SCORE_KEEPER_SPACE_BETWEEN = 256;

function getScoreKeeper(canvasWidth: number): ScoreKeeper {
  let x = canvasWidth / 2;
  let y = SCORE_KEEPER_Y_OFFSET;

  let scoreKeeper = new ScoreKeeper(
    x,
    y,
    SCORE_KEEPER_SPACE_BETWEEN,
    SCORE_KEEPER_FONT_SIZE,
    SCORE_KEEPER_FONT
  );

  return scoreKeeper;
}

const DIVIDING_LINE_WIDTH = 16;
const DIVIDING_LINE_DOT_HEIGHT = 24;
function getDividingLine(
  canvasWidth: number,
  canvasHeight: number
): DividingLine {
  const dividingLine = new DividingLine(
    canvasWidth / 2,
    0,
    DIVIDING_LINE_WIDTH,
    canvasHeight,
    DIVIDING_LINE_DOT_HEIGHT
  );

  return dividingLine;
}

export function GameScene(
  engine: Engine,
  canvasWidth: number,
  canvasHeight: number
): Scene {
  const scene = new Scene("#000");

  const paddles = getPaddles(canvasWidth, canvasHeight);
  const ball = getBall(canvasWidth, canvasHeight, paddles);
  const scoreKeeper = getScoreKeeper(canvasWidth);
  const dividingLine = getDividingLine(canvasWidth, canvasHeight);

  paddles[1].setController(new AIPaddleController(ball));

  const afterScoreTimer = new Timer(1);

  paddles[0].connectScoreSignal(ball.onScoreSignal);
  paddles[1].connectScoreSignal(ball.onScoreSignal);
  scoreKeeper.connectScoreSignal(ball.onScoreSignal);

  scene.addGameObjects(paddles);
  scene.addGameObject(ball);
  scene.addGameObject(scoreKeeper);
  scene.addGameObject(dividingLine);
  scene.addGameObject(afterScoreTimer);

  afterScoreTimer.onTimeoutSignal.subscribe(() => {
    paddles[0].enable();
    paddles[1].enable();
    ball.randomizeVelocity();
  });

  ball.onScoreSignal.subscribe((_: PlaySide) => {
    afterScoreTimer.start();
  });

  const resetScene = () => {
    ball.reset();
    paddles[0].reset();
    paddles[1].reset();
    scoreKeeper.reset();
    afterScoreTimer.reset();

    afterScoreTimer.start();
  };

  scene.enter = () => {
    resetScene();
  };

  return scene;
}
