import { Signal } from "../Engine/Event";
import { GameObject } from "../Engine/GameObject";
import { InputManager, MouseButton } from "../Engine/InputManager";

export class Button implements GameObject {
  onClickSignal: Signal<null> = new Signal<null>();
  onReleaseSignal: Signal<null> = new Signal<null>();

  x: number;
  y: number;
  width: number;
  height: number;

  backgroundcolor: string;
  textColor: string;

  text: string;
  fontSize: number;
  font: string;

  isHovering: boolean = false;
  sizeMultiplicationOnHover: number = 1.1;

  isPressed: boolean = false;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    backgroundColor: string,
    textColor: string,
    text: string,
    fontSize: number,
    font: string
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.backgroundcolor = backgroundColor;
    this.textColor = textColor;

    this.text = text;
    this.fontSize = fontSize;
    this.font = font;
  }

  render(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.backgroundcolor;

    ctx.fillRect(...this.getButtonPosition(), ...this.getButtonSize());

    ctx.fillStyle = this.textColor;
    ctx.font = `${this.getFontSize()}px ${this.font}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
      this.text,
      this.x + this.width / 2,
      this.y + this.height / 2,
      this.width
    );
  }

  private getFontSize(): number {
    return this.isHovering
      ? this.fontSize * this.sizeMultiplicationOnHover
      : this.fontSize;
  }

  private getButtonPosition(): [number, number] {
    if (this.isHovering) {
      return [
        this.x - this.width * ((this.sizeMultiplicationOnHover - 1) / 2),
        this.y - this.height * ((this.sizeMultiplicationOnHover - 1) / 2),
      ];
    } else {
      return [this.x, this.y];
    }
  }

  private getButtonSize(): [number, number] {
    if (this.isHovering) {
      return [
        this.width * this.sizeMultiplicationOnHover,
        this.height * this.sizeMultiplicationOnHover,
      ];
    } else {
      return [this.width, this.height];
    }
  }

  onClick() {
    if (this.isPressed) return;
    this.isPressed = true;
    this.onClickSignal.trigger(null);
  }

  onRelease() {
    if (!this.isPressed) return;
    this.isPressed = false;
    this.onReleaseSignal.trigger(null);
  }

  update(deltaTime: number, inputManager: InputManager): void {
    let [mouseX, mouseY] = inputManager.getMousePosition();

    if (
      mouseX > this.x &&
      mouseX < this.x + this.width &&
      mouseY > this.y &&
      mouseY < this.y + this.height
    ) {
      if (inputManager.isMousePressed(MouseButton.Left)) {
        this.onClick();
      } else {
        this.onRelease();
      }

      this.isHovering = true;
    } else {
      this.isHovering = false;
    }
  }
}
