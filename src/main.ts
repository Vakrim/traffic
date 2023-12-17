import "./style.css";
import {
  Engine,
  Render,
  Runner,
  Bodies,
  Composite,
  Body,
  Constraint,
  Vector,
  Common,
} from "matter-js";

function main() {
  const engine = Engine.create({ gravity: { x: 0, y: 0 } });

  const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
      width: 1200,
      height: 1000,
    },
  });

  const boxes = Array.from({ length: 5 }, () =>
    Bodies.rectangle(Common.random(0, 1000), Common.random(0, 1000), 80, 80)
  );

  const boxFrictionStatic = 500;

  boxes.push(
    ...Array.from({ length: 50 }, (_x, i) =>
      Bodies.rectangle(i * 85, -40, 60, 60, {
        frictionAir: 0.1,
        frictionStatic: boxFrictionStatic,
      })
    ),
    ...Array.from({ length: 50 }, (_x, i) =>
      Bodies.rectangle(i * 85, 1040, 60, 60, {
        frictionAir: 0.1,
        frictionStatic: boxFrictionStatic,
      })
    ),
    ...Array.from({ length: 50 }, (_x, i) =>
      Bodies.rectangle(-40, i * 85, 60, 60, {
        frictionAir: 0.1,
        frictionStatic: boxFrictionStatic,
      })
    ),
    ...Array.from({ length: 50 }, (_x, i) =>
      Bodies.rectangle(1040, i * 85, 60, 60, {
        frictionAir: 0.1,
        frictionStatic: boxFrictionStatic,
      })
    )
  );

  Composite.add(engine.world, boxes);

  const world = new World();

  const cars = Array.from({ length: 1 }, (i) =>
    world.add(
      new Car(Common.random(0, 1000), Common.random(0, 1000), engine.world)
    )
  );

  Render.run(render);

  const runner = Runner.create();

  const update = () => {
    Runner.tick(runner, engine, 1000 / 60);

    Render.lookAt(
      render,
      cars.map((c) => c.body),
      { x: 500, y: 500 }
    );

    world.update(1000 / 60);

    requestAnimationFrame(update);
  };

  requestAnimationFrame(update);
}

interface Actor {
  update(dt: number): void;
  body: Body;
}

class World {
  actors: Actor[] = [];

  add(actor: Actor) {
    this.actors.push(actor);
    return actor;
  }

  update(dt: number) {
    for (const actor of this.actors) {
      actor.update(dt);
    }
  }
}

class Car {
  body: Body;
  frontWheel: Body;
  rearWheel: Body;
  frontWheelConstraint: Constraint;
  rearWheelConstraint: Constraint;
  steering: number = 0;
  throttle: number = 0;

  constructor(x: number, y: number, world: Composite) {
    this.body = Bodies.rectangle(x, y, 80, 40);

    Body.setInertia(this.body, this.body.inertia * 2);

    this.frontWheel = Bodies.rectangle(x + 20, y, 30, 10, {
      collisionFilter: { category: 0 },
    });
    this.rearWheel = Bodies.rectangle(x - 20, y, 30, 10, {
      collisionFilter: { category: 0 },
    });

    this.frontWheelConstraint = Constraint.create({
      bodyA: this.body,
      pointA: { x: 20, y: 0 },
      bodyB: this.frontWheel,
      pointB: { x: 0, y: 0 },
      length: 0,
      stiffness: 0.7,
    });

    this.rearWheelConstraint = Constraint.create({
      bodyA: this.body,
      pointA: { x: -20, y: 0 },
      bodyB: this.rearWheel,
      pointB: { x: 0, y: 0 },
      length: 0,
      stiffness: 0.7,
    });

    Composite.add(world, [
      this.body,
      this.frontWheel,
      this.rearWheel,
      this.frontWheelConstraint,
      this.rearWheelConstraint,
    ]);
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
      this.throttle * 0.001
    );

    Body.applyForce(this.body, this.body.position, engine);
  }

  private applyWheelForce(wheel: Body) {
    const velocity = wheel.velocity;

    const normalDirection = {
      x: Math.cos(wheel.angle + Math.PI / 2),
      y: Math.sin(wheel.angle + Math.PI / 2),
    };

    const force = vectorProjection(velocity, normalDirection);

    Body.applyForce(wheel, wheel.position, force);
  }
}

function vectorProjection(projected: Vector, direction: Vector) {
  return Vector.mult(
    direction,
    -Vector.dot(projected, direction) / Vector.dot(direction, direction) / 1000
  );
}

main();

function isKeyDown(key: string) {
  return keys[key] || false;
}

const keys: { [key: string]: boolean } = {};

document.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});

document.addEventListener("keyup", (e) => {
  keys[e.key] = false;

  if(e.key === " ") {
    location.reload();
  }
});
