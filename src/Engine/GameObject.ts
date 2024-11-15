import { RenderContext, UpdateContext } from "./Engine";
import { InputManager } from "./InputManager";

export interface GameObject {
  render(context: RenderContext): void;
  update(context: UpdateContext): void;
}
