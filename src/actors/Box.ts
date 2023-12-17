import { Bodies, Body } from "matter-js";
import { World } from "../World";
import { Actor } from "./Actor";

export class Box implements Actor {
  body: Body;
  size: number;

  constructor(x: number, y: number, size: number, world: World) {
    this.body = Bodies.rectangle(x, y, size, size, {
      frictionAir: 0.1,
      frictionStatic: 500,
    });

    this.size = size;
    world.addPhysicsElements(this.body);
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.body.position.x, this.body.position.y);
    ctx.rotate(this.body.angle);

    ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);

    ctx.restore();
  }
}
