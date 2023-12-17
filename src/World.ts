import { Composite, Engine } from "matter-js";
import { Actor } from "./actors/Actor";

export class World {
  actors: Actor[] = [];
  engine: Engine;

  constructor(engine: Engine) {
    this.engine = engine;
  }

  add(...actors: Actor[]) {
    this.actors.push(...actors);
  }

  update(dt: number) {
    for (const actor of this.actors) {
      actor.update?.(dt);
    }
  }

  addPhysicsElements(
    ...elements: (import("matter-js").Body | import("matter-js").Constraint)[]
  ) {
    Composite.add(this.engine.world, elements);
  }
}
