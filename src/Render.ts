import { World } from "./World";

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

  render() {
    this.ctx.clearRect(0, 0, this.WIDTH, this.HEIGHT);
    this.ctx.fillStyle = "#122";
    this.ctx.fillRect(0, 0, this.WIDTH, this.HEIGHT);

    this.ctx.fillStyle = "#fff";

    this.ctx.save();

    this.ctx.scale(this.zoom, this.zoom);

    this.ctx.translate(
      this.offset.x + (this.WIDTH / 2) * zoomNormalization(this.zoom),
      this.offset.y + (this.HEIGHT / 2) * zoomNormalization(this.zoom)
    );

    for (const actor of this.world.actors) {
      actor.render(this.ctx);
    }

    this.ctx.restore();
  }
}

function zoomNormalization(x: number) {
  return 1 / x - 1;
}
