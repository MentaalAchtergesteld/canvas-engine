import { Ball, PlaySide } from "./Ball";
import { Signal } from "../Engine/Event";
import { GameObject } from "../Engine/GameObject";
import { InputManager } from "../Engine/InputManager";
import { RenderContext, UpdateContext } from "../Engine/Engine";

export class ScoreKeeper implements GameObject {
  private color: string = "#FFF";

  private x: number;
  private y: number;
  private spaceBetweenScores: number;
  private fontSize: number;
  private font: string;

  private leftScore: number;
  private rightScore: number;

  constructor(
    x: number,
    y: number,
    spaceBetweenScores: number,
    fontSize: number,
    font: string
  ) {
    this.x = x;
    this.y = y;
    this.spaceBetweenScores = spaceBetweenScores;
    this.fontSize = fontSize;
    this.font = font;

    this.leftScore = 0;
    this.rightScore = 0;
  }

  connectScoreSignal(signal: Signal<PlaySide>) {
    signal.subscribe(this.updateScore.bind(this));
  }

  render(context: RenderContext): void {
    let ctx = context.ctx;
    ctx.font = `${this.fontSize}px ${this.font}`;
    ctx.fillStyle = this.color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
      `${this.leftScore}`,
      this.x - this.spaceBetweenScores / 2,
      this.y
    );
    ctx.fillText(
      `${this.rightScore}`,
      this.x + this.spaceBetweenScores / 2,
      this.y
    );
  }

  update(context: UpdateContext): void {}

  private updateScore(scorer: PlaySide) {
    switch (scorer) {
      case PlaySide.Left:
        this.leftScore++;
        break;
      case PlaySide.Right:
        this.rightScore++;
        break;
    }
  }

  reset() {
    this.leftScore = 0;
    this.rightScore = 0;
  }
}
