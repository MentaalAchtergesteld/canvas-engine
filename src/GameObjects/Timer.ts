import { Signal } from "../Engine/Event";
import { GameObject } from "../Engine/GameObject";
import { InputManager } from "../Engine/InputManager";

export class Timer implements GameObject {
  onTimeoutSignal: Signal<null> = new Signal<null>();

  private time: number;
  private currentTime: number = 0;
  private isRunning: boolean = false;
  private autoRepeat: boolean = false;

  constructor(time: number) {
    this.time = time;
  }

  render(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void {}

  update(deltaTime: number, inputManager: InputManager): void {
    if (this.isRunning) {
      this.currentTime -= deltaTime;
      if (this.currentTime <= 0) {
        this.onTimeout();
      }
    }
  }

  private onTimeout() {
    this.onTimeoutSignal.trigger(null);
    if (this.autoRepeat) {
      this.start();
    } else {
      this.stop();
    }
  }

  start() {
    if (!this.isRunning) {
      this.currentTime = this.time;
      this.isRunning = true;
    }
  }

  stop() {
    if (this.isRunning) {
      this.currentTime = 0;
      this.isRunning = false;
    }
  }

  reset() {
    this.isRunning = false;
    this.currentTime = this.time;
  }
}
