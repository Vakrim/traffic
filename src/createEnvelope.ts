import { Point } from './Point';
import { Polygon } from './Polygon';
import { Segment } from './Segment';

export function createEnvelope(
  segment: Segment,
  padding: number,
  numberOfSemiCircleSpheres = 2
): Polygon {
  const segmentAngle = Math.atan2(
    segment.end.y - segment.start.y,
    segment.end.x - segment.start.x
  );

  const points: Point[] = [];

  for (let i = 0; i < numberOfSemiCircleSpheres; i++) {
    const angle = segmentAngle -
      (i * Math.PI) / (numberOfSemiCircleSpheres - 1) -
      Math.PI / 2;

    const x = segment.start.x + Math.cos(angle) * padding;
    const y = segment.start.y + Math.sin(angle) * padding;

    points.push({ x, y });
  }

  for (let i = 0; i < numberOfSemiCircleSpheres; i++) {
    const angle = segmentAngle -
      (i * Math.PI) / (numberOfSemiCircleSpheres - 1) +
      Math.PI / 2;

    const x = segment.end.x + Math.cos(angle) * padding;
    const y = segment.end.y + Math.sin(angle) * padding;

    points.push({ x, y });
  }

  return { points };
}
