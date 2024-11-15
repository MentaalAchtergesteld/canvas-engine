import { RenderContext, UpdateContext } from "./Engine";
import { GameObject } from "./GameObject";
import { InputManager } from "./InputManager";
import { SceneManager } from "./SceneManager";
import { SoundManager } from "./SoundManager";

export class Scene {
  private gameObjects: GameObject[] = [];

  backgroundColor: string;

  constructor(backgroundColor: string = "#FFF") {
    this.backgroundColor = backgroundColor;
  }

  enter() {}
  exit() {}

  update(context: UpdateContext): void {
    this.gameObjects.forEach((object) => object.update(context));
  }

  renderBackground(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  render(context: RenderContext): void {
    this.renderBackground(context.canvas, context.ctx);
    this.gameObjects.forEach((object) => object.render(context));
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
