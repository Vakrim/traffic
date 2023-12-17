import { Car } from "./actors/Car";
import { Render } from "./Render";
import { World } from "./World";
import "./style.css";
import {
  Engine,
  Render as DebugRender,
  Runner
} from "matter-js";
import { Box } from "./actors/Box";

function main() {
  const engine = Engine.create({ gravity: { x: 0, y: 0 } });

  const debugRender = DebugRender.create({
    element: document.body,
    engine: engine,
    options: {
      width: 1200,
      height: 1000,
    },
  });

  const world = new World(engine);

  world.add(
    ...Array.from({ length: 50 }, (_x, i) => new Box(i * 85, -40, 60, world)),
    ...Array.from(
      { length: 50 },
      (_x, i) => new Box(i * 85, 50 * 85, 60, world)
    ),
    ...Array.from({ length: 50 }, (_x, i) => new Box(-40, i * 85, 60, world)),
    ...Array.from(
      { length: 50 },
      (_x, i) => new Box(50 * 85, i * 85, 60, world)
    )
  );

  const render = new Render(world);

  const car = new Car(500, 500, world);
  world.add(car);

  DebugRender.run(debugRender);

  const runner = Runner.create();

  const update = () => {
    Runner.tick(runner, engine, 1000 / 60);

    world.update(1000 / 60);

    render.lookAt(
      car.body.position.x + car.body.velocity.x * 30,
      car.body.position.y + car.body.velocity.y * 30
    );

    render.zoomTo(1 / (car.body.speed / 10 + 1));

    render.render();

    requestAnimationFrame(update);
  };

  requestAnimationFrame(update);
}

main();
