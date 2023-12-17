import { Vector } from "matter-js";

export function projectVector(projected: Vector, direction: Vector) {
  return Vector.mult(
    direction,
    Vector.dot(projected, direction) / Vector.dot(direction, direction)
  );
}
