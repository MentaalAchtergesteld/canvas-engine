import { Err, Ok, Result } from "./Result";
import { InputManager } from "./InputManager";
import { Scene } from "./Scene";
import { SceneManager } from "./SceneManager";

class AudioManager {}

export class Engine {
  private static instance: Engine;

  private lastTime: number = 0;

  private inputManager: InputManager;
  private sceneManager: SceneManager;

  private isRunning: boolean = false;

  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(parentId: string, width: number, height: number) {
    let canvasResult = this.initCanvas(parentId, width, height);
    if (!canvasResult.success) throw Error(canvasResult.error);

    [this.canvas, this.ctx] = canvasResult.value;

    this.inputManager = new InputManager(this.canvas);
    this.sceneManager = new SceneManager();
  }

  static getInstance(
    canvasId: string = "gameCanvas",
    width: number = 128,
    height: number = 128
  ): Engine {
    if (!Engine.instance) {
      Engine.instance = new Engine(canvasId, width, height);
    }

    return Engine.instance;
  }

  getSceneManager(): SceneManager {
    return this.sceneManager;
  }

  getInputManager(): InputManager {
    return this.inputManager;
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

    this.sceneManager.getCurrentScene()?.update(deltaTime, this.inputManager);
    this.sceneManager.getCurrentScene()?.render(this.canvas, this.ctx);

    if (!this.isRunning) return;
    requestAnimationFrame(this.gameLoop.bind(this));
  }
}
