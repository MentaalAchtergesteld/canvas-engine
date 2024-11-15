import { RenderContext, UpdateContext } from "../Engine/Engine";
import { GameObject } from "../Engine/GameObject";
import { InputManager } from "../Engine/InputManager";

export class DividingLine implements GameObject {
  color: string = "#FFF";

  x: number;
  y: number;
  width: number;
  height: number;
  dotHeight: number;
  dotAmount: number;
  verticalOffset: number;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    dotHeight: number
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.dotHeight = dotHeight;

    this.dotAmount = Math.floor(this.height / this.dotHeight);
    const totalLineHeight = (this.dotAmount - 1) * this.dotHeight;
    const remainingSpace = this.height - totalLineHeight;

    this.verticalOffset = remainingSpace / 2;
  }
  render(context: RenderContext): void {
    let ctx = context.ctx;
    ctx.fillStyle = this.color;
    for (let i = 0; i < this.dotAmount; i++) {
      if (i % 2) continue;

      ctx.fillRect(
        this.x - this.width / 2,
        this.dotHeight * i + this.verticalOffset,
        this.width,
        this.dotHeight
      );
    }
  }

  update(context: UpdateContext): void {}
}
