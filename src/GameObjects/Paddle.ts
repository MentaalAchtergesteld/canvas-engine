import { Ball, PlaySide } from "./Ball";
import { Signal } from "../Engine/Event";
import { GameObject } from "../Engine/GameObject";
import { InputManager } from "../Engine/InputManager";
import { RenderContext, UpdateContext } from "../Engine/Engine";

interface PaddleController {
  getMoveDirection(currentY: number, inputManager: InputManager): number;
}

export class PlayerPaddleController implements PaddleController {
  upKey: string;
  downKey: string;

  constructor(upKey: string, downKey: string) {
    this.upKey = upKey;
    this.downKey = downKey;
  }

  getMoveDirection(currentY: number, inputManager: InputManager): number {
    let moveDirection = 0;
    if (inputManager.isPressed(this.upKey)) moveDirection--;
    if (inputManager.isPressed(this.downKey)) moveDirection++;
    return moveDirection;
  }
}

export class AIPaddleController implements PaddleController {
  ball: Ball;

  constructor(ball: Ball) {
    this.ball = ball;
  }

  getMoveDirection(currentY: number, inputManager: InputManager): number {
    if (currentY < this.ball.y) return 1;
    if (currentY > this.ball.y) return -1;
    return 0;
  }
}

export class Paddle implements GameObject {
  private color: string = "#FFFFFF";

  private x: number;
  private y: number;
  private width: number;
  private height: number;

  private upperConstraint: number;
  private lowerConstraint: number;

  private maxSpeed: number;

  private controller: PaddleController | null;

  private enabled: boolean = true;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    upperConstraint: number,
    lowerConstraint: number,
    maxSpeed: number,
    controller?: PaddleController
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.upperConstraint = upperConstraint;
    this.lowerConstraint = lowerConstraint;

    this.maxSpeed = maxSpeed;

    this.controller = controller || null;
  }

  connectScoreSignal(signal: Signal<PlaySide>) {
    signal.subscribe(this.onScore.bind(this));
  }

  render(context: RenderContext) {
    let ctx = context.ctx;
    ctx.fillStyle = this.color;

    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update(context: UpdateContext) {
    if (!this.enabled) return;
    if (this.controller == null) return;

    let inputManager = context.inputManager;
    let deltaTime = context.deltaTime;

    let moveDirection = this.controller.getMoveDirection(this.y, inputManager);

    this.y += this.maxSpeed * moveDirection * deltaTime;

    if (this.y < this.upperConstraint) this.y = this.upperConstraint;
    if (this.y + this.height > this.lowerConstraint)
      this.y = this.lowerConstraint - this.height;
  }

  private onScore(scorer: PlaySide) {
    this.reset();
    this.disable();
  }

  reset() {
    this.y = (this.upperConstraint + this.lowerConstraint - this.height) / 2;
  }

  getBoundingBox(): [number, number, number, number] {
    return [this.x, this.y, this.width, this.height];
  }

  enable() {
    this.enabled = true;
  }

  disable() {
    this.enabled = false;
  }

  setController(controller: PaddleController) {
    this.controller = controller;
  }
}
