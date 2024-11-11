import { InputManager } from "./InputManager";

export interface GameObject {
  render(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void;
  update(deltaTime: number, inputManager: InputManager): void;
}
