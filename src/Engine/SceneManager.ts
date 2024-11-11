import { Scene } from "./Scene";

export class SceneManager {
  private scenes: { [key: string]: Scene } = {};
  private currentScene: Scene | null = null;

  getCurrentScene(): Scene | null {
    return this.currentScene;
  }

  addScene(name: string, scene: Scene) {
    this.scenes[name] = scene;
  }

  switchScene(name: string): boolean {
    if (this.scenes[name] == null) return false;

    this.currentScene?.exit();
    this.currentScene = this.scenes[name];
    this.currentScene.enter();
    return true;
  }
}
