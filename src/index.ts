import { Ball } from "./ball";
import { setupCanvas } from "./canvas";
import { keys } from "./keys";
import { Paddle, PlaySide } from "./paddle";

const BACKGROUND_COLOR = "#000000";
const SCORE_SOUND: HTMLAudioElement = new Audio("./assets/KERK.mp3");
const BACKGROUND_MUSIC: HTMLAudioElement = new Audio("./assets/gaming.mp3");

let leftPaddle: Paddle;
let rightPaddle: Paddle;

let ball: Ball;

let leftScore: number = 0;
let rightScore: number = 0;

let gameTimer: number = 0;

const PADDLE_WIDTH = 32;
const PADDLE_HEIGHT = 192;
const PADDLE_WIDTH_OFFSET = 32;
const PADDLE_HEIGHT_OFFSET = 16;
const PADDLE_SPEED = 512;

function setupPaddles(
  canvasWidth: number,
  canvasHeight: number
): [Paddle, Paddle] {
  let leftPaddleX = 0 + PADDLE_WIDTH_OFFSET;
  let rightPaddleX = canvasWidth - PADDLE_WIDTH_OFFSET - PADDLE_WIDTH;

  let paddleY = (canvasHeight - PADDLE_HEIGHT) / 2;

  let paddleUpperConstraint = PADDLE_HEIGHT_OFFSET;
  let paddleLowerConstraint = canvasHeight - PADDLE_HEIGHT_OFFSET;

  let leftPaddle = new Paddle(
    leftPaddleX,
    paddleY,
    PADDLE_WIDTH,
    PADDLE_HEIGHT,
    paddleUpperConstraint,
    paddleLowerConstraint,
    PADDLE_SPEED,
    PlaySide.Left
  );

  let rightPaddle = new Paddle(
    rightPaddleX,
    paddleY,
    PADDLE_WIDTH,
    PADDLE_HEIGHT,
    paddleUpperConstraint,
    paddleLowerConstraint,
    PADDLE_SPEED,
    PlaySide.Right
  );

  return [leftPaddle, rightPaddle];
}

const BALL_RADIUS = 16;
const BALL_BASE_SPEED = 512;

function setupBall(canvasWidth: number, canvasHeight: number): Ball {
  let ballX = canvasWidth / 2;
  let ballY = canvasHeight / 2;

  let upperConstraint = 0;
  let lowerConstraint = canvasHeight;

  let leftConstraint = 0 - BALL_RADIUS * 2;
  let rightConstraint = canvasWidth + BALL_RADIUS * 2;

  //   let leftConstraint = 0;
  //   let rightConstraint = canvasWidth;

  let ball = new Ball(
    ballX,
    ballY,
    BALL_RADIUS,
    BALL_BASE_SPEED,
    upperConstraint,
    lowerConstraint,
    leftConstraint,
    rightConstraint
  );
  ball.randomizeVelocity();

  return ball;
}

async function loadFonts() {
  const pressStart2P = await new FontFace(
    "PressStart2P",
    "url(https://fonts.gstatic.com/s/pressstart2p/v15/e3t4euO8T-267oIAQAu6jDQyK3nVivM.woff2) format('woff2')"
  ).load();

  document.fonts.add(pressStart2P);
  await document.fonts.ready;
}

function startBackgroundMusic() {
  BACKGROUND_MUSIC.loop = true;
  BACKGROUND_MUSIC.play();
}

const interactionEvents = ["click", "keydown", "mousedown", "touchstart"];

interactionEvents.forEach((event) => {
  document.addEventListener(event, () => {
    startBackgroundMusic();
  });
});

async function main() {
  await loadFonts();
  const canvasParentId = "canvasParent";
  const canvasWidth = innerWidth;
  const canvasHeight = innerHeight;

  let canvasResult = setupCanvas(canvasParentId, canvasWidth, canvasHeight);

  if (!canvasResult.success) throw new Error(canvasResult.error);

  let [canvas, ctx] = canvasResult.value;

  [leftPaddle, rightPaddle] = setupPaddles(canvas.width, canvas.height);
  ball = setupBall(canvas.width, canvas.height);

  BACKGROUND_MUSIC.volume = 0.7;

  startLoop(loop, canvas, ctx);
}

function startLoop(
  loop: (
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    delta: number
  ) => void,
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
) {
  let lastTime: number | null = null;

  const frame = (currentTime: number) => {
    if (lastTime == null) lastTime = currentTime;

    const delta = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    loop(canvas, ctx, delta);

    requestAnimationFrame(frame);
  };

  requestAnimationFrame(frame);
}

function resetGame(canvas: HTMLCanvasElement) {
  leftPaddle.reset();
  rightPaddle.reset();
  ball.reset(canvas.width / 2, canvas.height / 2);
}

const FONT_SIZE = 48;
const FONT = "PressStart2P";
const FONT_COLOR = "#FFFFFF";
const SCORE_SPACE_BETWEEN = 1024;
const SCORE_VERTICAL_OFFSET = 48;

function drawScore(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  ctx.font = `${FONT_SIZE}px ${FONT}`;
  ctx.fillStyle = FONT_COLOR;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillText(
    `${leftScore}`,
    (canvas.width - SCORE_SPACE_BETWEEN / 2) / 2,
    SCORE_VERTICAL_OFFSET
  );
  ctx.fillText(
    `${rightScore}`,
    (canvas.width + SCORE_SPACE_BETWEEN / 2) / 2,
    SCORE_VERTICAL_OFFSET
  );
}

const DIVIDING_LINE_COLOR = "#FFFFFF";
const DIVIDING_LINE_WIDTH = 16;
const DIVIDING_LINE_DOT_HEIGHT = 24;

function drawDividingLine(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
) {
  ctx.fillStyle = DIVIDING_LINE_COLOR;

  let amountOfDots = canvas.height / DIVIDING_LINE_DOT_HEIGHT;
  let dividingLineX = (canvas.width - DIVIDING_LINE_WIDTH) / 2;

  for (let i = 0; i < amountOfDots; i++) {
    if (i % 2) {
      ctx.fillRect(
        dividingLineX,
        i * DIVIDING_LINE_DOT_HEIGHT,
        DIVIDING_LINE_WIDTH,
        DIVIDING_LINE_DOT_HEIGHT
      );
    }
  }
}

function loop(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  delta: number
) {
  gameTimer += delta;

  ball.maxSpeed = BALL_BASE_SPEED + gameTimer * 10;

  ctx.fillStyle = BACKGROUND_COLOR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawScore(canvas, ctx);
  drawDividingLine(canvas, ctx);

  leftPaddle.render(ctx);
  rightPaddle.render(ctx);

  ball.render(ctx);

  leftPaddle.update(keys, delta);
  rightPaddle.update(keys, delta);
  ball.update(delta, leftPaddle, rightPaddle);

  let winner = ball.checkWinner();

  if (winner != null) {
    SCORE_SOUND.currentTime = 0;
    SCORE_SOUND.play();
    resetGame(canvas);

    switch (winner) {
      case PlaySide.Left:
        leftScore++;
        break;
      case PlaySide.Right:
        rightScore++;
        break;
    }
  }
}

main();
