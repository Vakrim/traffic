import { Point } from './Point';

export interface Segment {
  start: Point;
  end: Point;
}

export function hashSegment(segment: Segment) {
  return `${segment.start.x},${segment.start.y}-${segment.end.x},${segment.end.y}`;
}
