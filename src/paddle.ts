import { Keys } from "./keys";

export enum PlaySide {
  Left,
  Right,
}

export class Paddle {
  color: string = "#FFFFFF";

  x: number;
  y: number;
  width: number;
  height: number;

  upperConstraint: number;
  lowerConstraint: number;

  maxSpeed: number;

  playSide: PlaySide;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    upperConstraint: number,
    lowerConstraint: number,
    maxSpeed: number,
    playSide: PlaySide
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.upperConstraint = upperConstraint;
    this.lowerConstraint = lowerConstraint;

    this.maxSpeed = maxSpeed;

    this.playSide = playSide;
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;

    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update(keys: Keys, delta: number) {
    let move_direction = 0;

    switch (this.playSide) {
      case PlaySide.Left:
        if (keys["w"]) move_direction--;
        if (keys["s"]) move_direction++;
        break;
      case PlaySide.Right:
        if (keys["ArrowUp"]) move_direction--;
        if (keys["ArrowDown"]) move_direction++;
        break;
    }

    this.y += this.maxSpeed * move_direction * delta;

    if (this.y < this.upperConstraint) this.y = this.upperConstraint;
    if (this.y + this.height > this.lowerConstraint)
      this.y = this.lowerConstraint - this.height;
  }

  reset() {
    this.y = (this.upperConstraint + this.lowerConstraint - this.height) / 2;
  }
}
