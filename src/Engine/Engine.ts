import { Err, Ok, Result } from "./ReturnTypes";
import { InputManager } from "./InputManager";
import { Scene } from "./Scene";
import { SceneManager } from "./SceneManager";
import { SoundManager } from "./SoundManager";

export type UpdateContext = {
  inputManager: InputManager;
  soundManager: SoundManager;
  sceneManager: SceneManager;
  deltaTime: number;
};

export type RenderContext = {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
};

export class Engine {
  private lastTime: number = 0;

  public inputManager: InputManager;
  public soundManager: SoundManager;
  public sceneManager: SceneManager;

  private isRunning: boolean = false;

  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(parentId: string, width: number, height: number) {
    let canvasResult = this.initCanvas(parentId, width, height);
    if (!canvasResult.success) throw Error(canvasResult.error);

    [this.canvas, this.ctx] = canvasResult.value;

    this.inputManager = new InputManager(this.canvas);
    this.soundManager = new SoundManager();
    this.sceneManager = new SceneManager();
  }

  private initCanvas(
    parentId: string,
    width: number,
    height: number
  ): Result<[HTMLCanvasElement, CanvasRenderingContext2D], string> {
    let parent = document.getElementById(parentId);
    if (parent == null) return Err("Could not get parent element.");

    let canvas = document.createElement("canvas") as HTMLCanvasElement;
    canvas.width = width;
    canvas.height = height;

    let ctx = canvas.getContext("2d");
    if (ctx == null) return Err("Could not get rendering context.");

    parent.appendChild(canvas);

    return Ok([canvas, ctx]);
  }

  start() {
    this.lastTime = Date.now();
    this.isRunning = true;
    requestAnimationFrame(this.gameLoop.bind(this));
  }

  stop() {
    this.isRunning = false;
  }

  private gameLoop() {
    const now = Date.now();
    const deltaTime = (now - this.lastTime) / 1000;

    this.lastTime = now;

    this.sceneManager.getCurrentScene()?.update({
      inputManager: this.inputManager,
      soundManager: this.soundManager,
      sceneManager: this.sceneManager,
      deltaTime,
    });
    this.sceneManager
      .getCurrentScene()
      ?.render({ canvas: this.canvas, ctx: this.ctx });

    if (!this.isRunning) return;
    requestAnimationFrame(this.gameLoop.bind(this));
  }
}
