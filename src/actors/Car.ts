import { isKeyDown } from "../isKeyDown";
import { Bodies, Body, Constraint, Vector } from "matter-js";
import { projectVector } from "../projectVector";
import { Actor } from "./Actor";
import { World } from "../World";
import { images } from "../loadImage";
import { debugVector, log } from "../debugging";

const SCALE = 100;

const CAR_LENGTH = 3.92 * SCALE;
const CAR_WIDTH = 1.74 * SCALE;
const AXLE_INSET = 0.77 * SCALE;
const WHEEL_RADIUS = 0.35 * SCALE;
const WHEEL_WIDTH = 0.2 * SCALE;
const FRONT_WHEEL_FRICTION = 0.04;
const REAR_WHEEL_FRICTION = 0.05;
const MAX_WHEEL_FRICTION_FORCE = 0.25;

export class Car implements Actor {
  body: Body;
  frontWheel: Body;
  rearWheel: Body;
  frontWheelConstraint: Constraint;
  rearWheelConstraint: Constraint;
  steering: number = 0;
  throttle: number = 0;
  maxThrust = 0.3;
  previousVelocity: Vector = { x: 0, y: 0 };

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

    this.applyWheelForce(this.frontWheel, FRONT_WHEEL_FRICTION);
    this.applyWheelForce(this.rearWheel, REAR_WHEEL_FRICTION);

    const engine = Vector.mult(
      {
        x: Math.cos(this.body.angle),
        y: Math.sin(this.body.angle),
      },
      this.throttle * this.maxThrust
    );

    const acceleration = Vector.mult(
      Vector.sub(this.body.velocity, this.previousVelocity),
      1 / dt
    );

    debugVector(Vector.mult(acceleration, 1000), this.body.position);

    const accelerationAngle = angleBetween(
      { x: Math.cos(this.body.angle), y: Math.sin(this.body.angle) },
      acceleration
    );

    debugVector(
      Vector.mult(
        { x: Math.cos(this.body.angle), y: Math.sin(this.body.angle) },
        1000
      ),
      this.body.position,
      { strokeStyle: "green" }
    );

    log("accelerationAngle:");
    log(accelerationAngle);

    this.previousVelocity.x = this.body.velocity.x;
    this.previousVelocity.y = this.body.velocity.y;

    Body.applyForce(this.body, this.body.position, engine);
  }

  private applyWheelForce(wheel: Body, friction: number) {
    const velocity = wheel.velocity;

    const normalDirection = {
      x: Math.cos(wheel.angle + Math.PI / 2),
      y: Math.sin(wheel.angle + Math.PI / 2),
    };

    const force = projectVector(
      Vector.mult(velocity, -friction),
      normalDirection
    );

    if (Vector.magnitude(force) > MAX_WHEEL_FRICTION_FORCE) {
      Vector.mult(force, MAX_WHEEL_FRICTION_FORCE / Vector.magnitude(force));
    }

    Body.applyForce(wheel, wheel.position, force);
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.save();

    ctx.translate(this.body.position.x, this.body.position.y);

    ctx.rotate(this.body.angle);

    ctx.drawImage(
      images.car,
      -CAR_LENGTH / 2,
      -CAR_WIDTH / 2,
      CAR_LENGTH,
      CAR_WIDTH
    );

    ctx.restore();
  }
}

function angleBetween(v1: Vector, v2: Vector) {
  // Math.acos(dot(p1, p2) / (mag(p1) * mag(p2)));

  const dot = v1.x * v2.x + v1.y * v2.y;
  const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
  const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);

  return Math.acos(dot / (mag1 * mag2));
}
