import { World } from "./World";
import { renderDebug, renderLogs } from "./debugging";
import { images } from "./loadImage";

export class Render {
  WIDTH = 1200;
  HEIGHT = 1000;
  canvas: HTMLCanvasElement;
  world: World;
  ctx: CanvasRenderingContext2D;

  zoom = 1;
  offset = { x: 0, y: 0 };
  CAMERA_EASE = 0.1;

  constructor(world: World) {
    const canvas = document.querySelector<HTMLCanvasElement>("canvas#game");

    if (!canvas) {
      throw new Error("Canvas element not found");
    }

    canvas.width = this.WIDTH;
    canvas.height = this.HEIGHT;

    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.world = world;
  }

  lookAt(x: number, y: number) {
    const targetOffset = {
      x: this.WIDTH / 2 - x,
      y: this.HEIGHT / 2 - y,
    };

    this.offset.x =
      this.CAMERA_EASE * targetOffset.x +
      (1 - this.CAMERA_EASE) * this.offset.x;
    this.offset.y =
      this.CAMERA_EASE * targetOffset.y +
      (1 - this.CAMERA_EASE) * this.offset.y;
  }

  zoomTo(zoom: number) {
    this.zoom = this.CAMERA_EASE * zoom + (1 - this.CAMERA_EASE) * this.zoom;
  }

  private getTransformMatrix() {
    const d = new DOMMatrix([1, 0, 0, 1, 0, 0]);

    d.scaleSelf(this.zoom, this.zoom);

    d.translateSelf(
      this.offset.x + (this.WIDTH / 2) * zoomNormalization(this.zoom),
      this.offset.y + (this.HEIGHT / 2) * zoomNormalization(this.zoom)
    );

    return d;
  }

  render() {
    this.ctx.clearRect(0, 0, this.WIDTH, this.HEIGHT);
    this.ctx.fillStyle = "#122";
    this.ctx.fillRect(0, 0, this.WIDTH, this.HEIGHT);

    this.ctx.save();

    const transform = this.getTransformMatrix();

    this.ctx.setTransform(transform);

    const inverseTransform = transform.inverse();

    const p = inverseTransform.transformPoint({ x: 0, y: 0 });

    const pattern = this.ctx.createPattern(images.road, "repeat")!;
    this.ctx.fillStyle = pattern;
    this.ctx.fillRect(
      p.x,
      p.y,
      this.WIDTH / this.zoom,
      this.HEIGHT / this.zoom
    );

    this.ctx.fillStyle = "#fff";

    for (const actor of this.world.actors) {
      actor.render(this.ctx);
    }

    renderDebug(this.ctx);

    this.ctx.restore();

    renderLogs(this.ctx);
  }
}

function zoomNormalization(x: number) {
  return 1 / x - 1;
}
