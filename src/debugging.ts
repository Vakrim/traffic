import { Vector } from "matter-js";

const logs: string[] = [];
const drawDebugs: ((ctx: CanvasRenderingContext2D) => void)[] = [];

export function log(value: string | number) {
  logs.push(value.toString());
}

export function renderLogs(ctx: CanvasRenderingContext2D) {
  ctx.save();
  ctx.font = "16px monospace";
  ctx.fillStyle = "white";
  ctx.textBaseline = "top";
  ctx.textAlign = "left";

  let y = 0;
  for (const log of logs) {
    ctx.fillText(log, 0, y);
    y += 16;
  }

  ctx.restore();
  logs.length = 0;
}

export function drawDebug(draw: (ctx: CanvasRenderingContext2D) => void) {
  drawDebugs.push(draw);
}

export function renderDebug(ctx: CanvasRenderingContext2D) {
  for (const draw of drawDebugs) {
    draw(ctx);
  }
  drawDebugs.length = 0;
}

export function debugVector(
  vector: Vector,
  position: Vector,
  { strokeStyle = "red", lineWidth = 4 } = {}
) {
  drawDebug((ctx) => {
    ctx.save();

    ctx.translate(position.x, position.y);

    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(vector.x, vector.y);
    ctx.stroke();

    ctx.restore();
  });
}
