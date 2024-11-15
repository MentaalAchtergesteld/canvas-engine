import { RenderContext, UpdateContext } from "../../Engine/Engine";
import { Signal } from "../../Engine/Event";
import { GameObject } from "../../Engine/GameObject";
import { Paddle } from "./Paddle";

function getRandomPitchVariation(): number {
  return 0.95 + Math.random() * 0.1;
}

export enum PlaySide {
  Left,
  Right,
}

export class Ball implements GameObject {
  onScoreSignal: Signal<PlaySide> = new Signal<PlaySide>();

  private color: string = "#FFFFFF";
  private hitSound: HTMLAudioElement = new Audio("./assets/hit_sfx.mp3");

  x: number;
  y: number;
  private xVel: number;
  private yVel: number;

  private radius: number;

  private maxSpeed: number;

  private upperConstraint: number;
  private lowerConstraint: number;
  private leftConstraint: number;
  private rightConstraint: number;

  private leftPaddle: Paddle;
  private rightPaddle: Paddle;

  constructor(
    x: number,
    y: number,
    radius: number,
    maxSpeed: number,
    upperConstraint: number,
    lowerConstraint: number,
    leftConstraint: number,
    rightConstraint: number,
    paddles: [Paddle, Paddle]
  ) {
    this.x = x;
    this.y = y;
    this.xVel = 0;
    this.yVel = 0;

    this.radius = radius;

    this.maxSpeed = maxSpeed;

    this.upperConstraint = upperConstraint;
    this.lowerConstraint = lowerConstraint;
    this.leftConstraint = leftConstraint;
    this.rightConstraint = rightConstraint;

    this.leftPaddle = paddles[0];
    this.rightPaddle = paddles[1];
  }

  randomizeVelocity() {
    const directions = [
      { x: -1 / Math.sqrt(2), y: -1 / Math.sqrt(2) },
      { x: 1 / Math.sqrt(2), y: -1 / Math.sqrt(2) },
      { x: -1 / Math.sqrt(2), y: 1 / Math.sqrt(2) },
      { x: 1 / Math.sqrt(2), y: 1 / Math.sqrt(2) },
    ];

    const randomIndex = Math.floor(Math.random() * directions.length);
    this.xVel = directions[randomIndex].x;
    this.yVel = directions[randomIndex].y;
  }

  render(context: RenderContext) {
    let ctx = context.ctx;
    ctx.fillStyle = this.color;
    ctx.fillRect(
      this.x - this.radius,
      this.y - this.radius,
      this.radius * 2,
      this.radius * 2
    );
  }

  update(context: UpdateContext) {
    this.x += this.xVel * this.maxSpeed * context.deltaTime;
    this.y += this.yVel * this.maxSpeed * context.deltaTime;

    this.reflectVerticalBoundaries();
    this.reflectPaddle(this.leftPaddle);
    this.reflectPaddle(this.rightPaddle);

    let scorer = this.checkIfScored();
    if (scorer != null) this.onScore(scorer);
  }

  private playHitSound() {
    this.hitSound.playbackRate = getRandomPitchVariation();
    this.hitSound.currentTime = 0;
    this.hitSound.play();
  }

  private reflectVerticalBoundaries() {
    if (this.y - this.radius <= this.upperConstraint) {
      this.playHitSound();
      let overlap = this.y - this.radius - this.upperConstraint;
      this.y -= overlap;
      this.yVel *= -1;
    }
    if (this.y + this.radius >= this.lowerConstraint) {
      this.playHitSound();
      let overlap = this.y + this.radius - this.lowerConstraint;
      this.y -= overlap;
      this.yVel *= -1;
    }
  }

  private reflectHorizontalBoundaries() {
    if (this.x - this.radius <= this.leftConstraint) {
      this.playHitSound();
      let overlap = this.x - this.radius - this.leftConstraint;
      this.x -= overlap;
      this.xVel *= -1;
    }
    if (this.x + this.radius >= this.rightConstraint) {
      this.hitSound.play();
      let overlap = this.x + this.radius - this.rightConstraint;
      this.x -= overlap;
      this.xVel *= -1;
    }
  }

  private reflectPaddle(paddle: Paddle) {
    let [paddleX, paddleY, paddleWidth, paddleHeight] = paddle.getBoundingBox();
    let paddleHalfWidth = paddleWidth / 2;
    let paddleHalfHeight = paddleHeight / 2;

    let paddleCenterX = paddleX + paddleHalfWidth;
    let paddleCenterY = paddleY + paddleHalfHeight;

    let positionDifferenceX = this.x - paddleCenterX;
    let positionDifferenceY = this.y - paddleCenterY;

    let overlapX =
      paddleHalfWidth + this.radius - Math.abs(positionDifferenceX);
    let overlapY =
      paddleHalfHeight + this.radius - Math.abs(positionDifferenceY);

    if (overlapX > 0 && overlapY > 0) {
      this.playHitSound();
      if (overlapX < overlapY) {
        this.x += Math.sign(positionDifferenceX) * overlapX;
        this.xVel *= -1;
      } else {
        this.y += Math.sign(positionDifferenceY) * overlapY;
        this.yVel *= -1;
      }
    }
  }

  private onScore(scorer: PlaySide) {
    this.reset();
    this.onScoreSignal.trigger(scorer);
  }

  private checkIfScored(): PlaySide | null {
    if (this.x - this.radius <= this.leftConstraint) {
      return PlaySide.Right;
    }
    if (this.x + this.radius >= this.rightConstraint) {
      return PlaySide.Left;
    }

    return null;
  }

  reset() {
    this.x = (this.leftConstraint + this.rightConstraint) / 2;
    this.y = (this.upperConstraint + this.lowerConstraint) / 2;
    this.xVel = 0;
    this.yVel = 0;
  }
}
