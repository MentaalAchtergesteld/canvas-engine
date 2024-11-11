import { GameObject } from "./GameObject";
import { InputManager } from "./InputManager";

export class Scene {
  private gameObjects: GameObject[] = [];

  backgroundColor: string;

  constructor(backgroundColor: string = "#FFF") {
    this.backgroundColor = backgroundColor;
  }

  enter() {}
  exit() {}

  update(deltaTime: number, inputManager: InputManager): void {
    this.gameObjects.forEach((object) =>
      object.update(deltaTime, inputManager)
    );
  }

  render(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    this.gameObjects.forEach((object) => object.render(canvas, ctx));
  }

  addGameObject(gameObject: GameObject): void {
    this.gameObjects.push(gameObject);
  }

  addGameObjects(gameObjects: GameObject[]): void {
    gameObjects.forEach((object) => this.addGameObject(object));
  }

  removeGameObject(gameObject: GameObject): void {
    this.gameObjects = this.gameObjects.filter(
      (object) => object != gameObject
    );
  }
}
