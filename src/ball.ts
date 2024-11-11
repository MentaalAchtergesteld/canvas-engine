import { Paddle, PlaySide } from "./paddle";

function getRandomPitchVariation(): number {
  return 0.95 + Math.random() * 0.1;
}

export class Ball {
  color: string = "#FFFFFF";
  hitSound: HTMLAudioElement = new Audio("./assets/hit_sfx.mp3");

  x: number;
  y: number;
  xVel: number;
  yVel: number;

  radius: number;

  maxSpeed: number;

  upperConstraint: number;
  lowerConstraint: number;
  leftConstraint: number;
  rightConstraint: number;

  constructor(
    x: number,
    y: number,
    radius: number,
    maxSpeed: number,
    upperConstraint: number,
    lowerConstraint: number,
    leftConstraint: number,
    rightConstraint: number
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

  render(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    // ctx.beginPath();
    // ctx.ellipse(this.x, this.y, this.radius, this.radius, 0, 0, Math.PI * 2);
    // ctx.fill();
    // ctx.closePath();
    ctx.fillRect(
      this.x - this.radius,
      this.y - this.radius,
      this.radius * 2,
      this.radius * 2
    );
  }

  playHitSound() {
    this.hitSound.playbackRate = getRandomPitchVariation();
    this.hitSound.currentTime = 0;
    this.hitSound.play();
  }

  reflectVerticalBoundaries() {
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

  reflectHorizontalBoundaries() {
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

  reflectPaddle(paddle: Paddle) {
    let paddleHalfWidth = paddle.width / 2;
    let paddleHalfHeight = paddle.height / 2;

    let paddleCenterX = paddle.x + paddleHalfWidth;
    let paddleCenterY = paddle.y + paddleHalfHeight;

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

  update(delta: number, leftPaddle: Paddle, rightPaddle: Paddle) {
    this.reflectVerticalBoundaries();
    this.reflectPaddle(leftPaddle);
    this.reflectPaddle(rightPaddle);
    this.x += this.xVel * this.maxSpeed * delta;
    this.y += this.yVel * this.maxSpeed * delta;
  }

  checkWinner(): PlaySide | null {
    if (this.x - this.radius <= this.leftConstraint) {
      return PlaySide.Right;
    }
    if (this.x + this.radius >= this.rightConstraint) {
      return PlaySide.Left;
    }

    return null;
  }

  reset(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.randomizeVelocity();
  }
}
