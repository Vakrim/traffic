import { Point } from './Point';
import { Segment } from './Segment';

export function segmentsIntersection(
  segmentA: Segment,
  segmentB: Segment
): Point | null {
  if (
    segmentA.start.x === segmentA.end.x &&
    segmentB.start.x === segmentB.end.x
  ) {
    return null;
  }

  if (segmentA.start.x === segmentA.end.x) {
    const slopeB =
      (segmentB.end.y - segmentB.start.y) / (segmentB.end.x - segmentB.start.x);
    const interceptB = segmentB.start.y - slopeB * segmentB.start.x;
    const x = segmentA.start.x;
    const y = slopeB * x + interceptB;
    const point = { x, y };

    if (
      isPointOnSegment(point, segmentA) &&
      isPointOnSegment(point, segmentB)
    ) {
      return point;
    } else {
      return null;
    }
  }

  if (segmentB.start.x === segmentB.end.x) {
    const slopeA =
      (segmentA.end.y - segmentA.start.y) / (segmentA.end.x - segmentA.start.x);
    const interceptA = segmentA.start.y - slopeA * segmentA.start.x;
    const x = segmentB.start.x;
    const y = slopeA * x + interceptA;
    const point = { x, y };

    if (
      isPointOnSegment(point, segmentA) &&
      isPointOnSegment(point, segmentB)
    ) {
      return point;
    } else {
      return null;
    }
  }

  const slopeA =
    (segmentA.end.y - segmentA.start.y) / (segmentA.end.x - segmentA.start.x);
  const slopeB =
    (segmentB.end.y - segmentB.start.y) / (segmentB.end.x - segmentB.start.x);

  if (slopeA === slopeB) {
    return null;
  }

  const interceptA = segmentA.start.y - slopeA * segmentA.start.x;
  const interceptB = segmentB.start.y - slopeB * segmentB.start.x;

  const x = (interceptB - interceptA) / (slopeA - slopeB);
  const y = slopeA * x + interceptA;

  const point = { x, y };

  if (isPointOnSegment(point, segmentA) && isPointOnSegment(point, segmentB)) {
    return point;
  } else {
    return null;
  }
}

function isPointOnSegment(point: Point, segment: Segment): boolean {
  const minX = Math.min(segment.start.x, segment.end.x);
  const maxX = Math.max(segment.start.x, segment.end.x);
  const minY = Math.min(segment.start.y, segment.end.y);
  const maxY = Math.max(segment.start.y, segment.end.y);

  return (
    point.x >= minX && point.x <= maxX && point.y >= minY && point.y <= maxY
  );
}
