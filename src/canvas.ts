import { Err, Ok, Result } from "./result";

function createCanvas(
  parentElementId: string,
  width: number,
  height: number
): Result<HTMLCanvasElement, string> {
  const parent = document.getElementById(parentElementId);
  if (parent == null) return Err("Could not find parent element.");

  const canvasElement = document.createElement("canvas") as HTMLCanvasElement;
  canvasElement.width = width;
  canvasElement.height = height;

  parent.appendChild(canvasElement);

  return Ok(canvasElement);
}

export function setupCanvas(
  parentElementId: string,
  width: number,
  height: number
): Result<[HTMLCanvasElement, CanvasRenderingContext2D], string> {
  let canvasResult = createCanvas(parentElementId, width, height);
  if (!canvasResult.success) return canvasResult;

  let canvas = canvasResult.value;

  let ctx = canvas.getContext("2d");
  if (ctx == null) return Err("Could not get canvas rendering context.");

  return Ok([canvas, ctx]);
}
