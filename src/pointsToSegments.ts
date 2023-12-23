import { Point } from './Point';
import { Segment } from './Segment';

export function pointsToSegments(path: Point[]): Segment[] {
  const segments: Segment[] = [];

  for (let i = 0; i < path.length - 1; i++) {
    segments.push({
      start: path[i],
      end: path[i + 1],
    });
  }

  return reduceSegmentsOfPath(segments);
}

function reduceSegmentsOfPath(path: Segment[]): Segment[] {
  const reducedPath: Segment[] = [];

  for (const segment of path) {
    const lastSegment = reducedPath[reducedPath.length - 1];

    if (lastSegment && segmentsAreCollinear(lastSegment, segment)) {
      lastSegment.end = segment.end;
    } else {
      reducedPath.push(segment);
    }
  }

  return reducedPath;
}

function segmentsAreCollinear(lastSegment: Segment, segment: Segment) {
  const slopeA =
    (lastSegment.end.y - lastSegment.start.y) /
    (lastSegment.end.x - lastSegment.start.x);
  const slopeB =
    (segment.end.y - segment.start.y) / (segment.end.x - segment.start.x);

  return slopeA === slopeB;
}
