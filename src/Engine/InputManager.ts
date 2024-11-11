export enum MouseButton {
  Left,
  Right,
}

export class InputManager {
  private keyStates: { [key: string]: boolean } = {};

  private mouseLeftPressed: boolean = false;
  private mouseRightPressed: boolean = false;

  private mouseX = 0;
  private mouseY = 0;

  constructor(parentElement: HTMLElement) {
    document.addEventListener("keydown", (event) => this.onKeyDown(event));
    document.addEventListener("keyup", (event) => this.onKeyUp(event));

    document.addEventListener("mousedown", (event) => this.onMouseDown(event));
    document.addEventListener("mouseup", (event) => this.onMouseUp(event));

    parentElement.addEventListener("mousemove", (event) =>
      this.onMouseMove(event)
    );
  }

  onKeyDown(event: KeyboardEvent) {
    this.keyStates[event.key] = true;
  }

  onKeyUp(event: KeyboardEvent) {
    this.keyStates[event.key] = false;
  }

  onMouseDown(event: MouseEvent) {
    switch (event.button) {
      case 0:
        return (this.mouseLeftPressed = true);
      case 2:
        return (this.mouseRightPressed = true);
    }
  }

  onMouseUp(event: MouseEvent) {
    switch (event.button) {
      case 0:
        return (this.mouseLeftPressed = false);
      case 2:
        return (this.mouseRightPressed = false);
    }
  }

  onMouseMove(event: MouseEvent) {
    this.mouseX = event.offsetX;
    this.mouseY = event.offsetY;
  }

  isPressed(key: string) {
    return !!this.keyStates[key];
  }

  isMousePressed(button: MouseButton): boolean {
    switch (button) {
      case MouseButton.Left:
        return this.mouseLeftPressed;
      case MouseButton.Right:
        return this.mouseRightPressed;
    }
  }

  getMousePosition(): [number, number] {
    return [this.mouseX, this.mouseY];
  }
}
