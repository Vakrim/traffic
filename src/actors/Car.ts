import { isKeyDown } from "../isKeyDown";
import { Bodies, Composite, Body, Constraint, Vector } from "matter-js";
import { projectVector } from "../projectVector";
import { Actor } from "./Actor";
import { World } from "../World";
import carImageUrl from "../assets/car.png";

const SCALE = 100;

const CAR_LENGTH = 3.92 * SCALE;
const CAR_WIDTH = 1.74 * SCALE;
const AXLE_INSET = 0.77 * SCALE;
const WHEEL_RADIUS = 0.35 * SCALE;
const WHEEL_WIDTH = 0.2 * SCALE;
const WHEEL_FRICTION = 0.05;

export class Car implements Actor {
  body: Body;
  frontWheel: Body;
  rearWheel: Body;
  frontWheelConstraint: Constraint;
  rearWheelConstraint: Constraint;
  steering: number = 0;
  throttle: number = 0;

  constructor(x: number, y: number, world: World) {
    this.body = Bodies.rectangle(x, y, CAR_LENGTH, CAR_WIDTH, {});

    this.frontWheel = Bodies.rectangle(
      x + (CAR_LENGTH / 2 - AXLE_INSET),
      y,
      WHEEL_RADIUS * 2,
      WHEEL_WIDTH,
      {
        collisionFilter: { category: 0 },
      }
    );
    this.rearWheel = Bodies.rectangle(
      x - (CAR_LENGTH / 2 - AXLE_INSET),
      y,
      WHEEL_RADIUS * 2,
      WHEEL_WIDTH,
      {
        collisionFilter: { category: 0 },
      }
    );

    this.frontWheelConstraint = Constraint.create({
      bodyA: this.body,
      pointA: { x: CAR_LENGTH / 2 - AXLE_INSET, y: 0 },
      bodyB: this.frontWheel,
      pointB: { x: 0, y: 0 },
      length: 0,
      stiffness: 0.7,
    });

    this.rearWheelConstraint = Constraint.create({
      bodyA: this.body,
      pointA: { x: -(CAR_LENGTH / 2 - AXLE_INSET), y: 0 },
      bodyB: this.rearWheel,
      pointB: { x: 0, y: 0 },
      length: 0,
      stiffness: 0.7,
    });

    world.addPhysicsElements(
      this.body,
      this.frontWheel,
      this.rearWheel,
      this.frontWheelConstraint,
      this.rearWheelConstraint
    );
  }

  update(dt: number) {
    this.throttle = 0;
    this.steering *= 0.9;

    if (isKeyDown("ArrowUp")) {
      this.throttle = 1;
    }

    if (isKeyDown("ArrowDown")) {
      this.throttle = -1;
    }

    if (isKeyDown("ArrowLeft")) {
      this.steering = Math.max(-1, this.steering - 0.1);
    }

    if (isKeyDown("ArrowRight")) {
      this.steering = Math.min(1, this.steering + 0.1);
    }

    Body.setAngle(
      this.frontWheel,
      this.body.angle + (this.steering * Math.PI) / 4
    );
    Body.setAngle(this.rearWheel, this.body.angle);

    this.applyWheelForce(this.frontWheel);
    this.applyWheelForce(this.rearWheel);

    const engine = Vector.mult(
      {
        x: Math.cos(this.body.angle),
        y: Math.sin(this.body.angle),
      },
      this.throttle * 0.1
    );

    Body.applyForce(this.body, this.body.position, engine);
  }

  private applyWheelForce(wheel: Body) {
    const velocity = wheel.velocity;

    const normalDirection = {
      x: Math.cos(wheel.angle + Math.PI / 2),
      y: Math.sin(wheel.angle + Math.PI / 2),
    };

    const force = projectVector(
      Vector.mult(velocity, -WHEEL_FRICTION),
      normalDirection
    );

    Body.applyForce(wheel, wheel.position, force);
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.save();

    ctx.translate(this.body.position.x, this.body.position.y);

    ctx.rotate(this.body.angle);

    ctx.drawImage(
      carImage,
      -CAR_LENGTH / 2,
      -CAR_WIDTH / 2,
      CAR_LENGTH,
      CAR_WIDTH
    );

    ctx.restore();
  }
}

const carImage = new Image();
carImage.src = carImageUrl;
