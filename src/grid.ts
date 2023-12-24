import { HashMap } from './HashMap';
import { Point } from './Point';
import { Segment, hashSegment } from './Segment';
import { createEnvelope } from './createEnvelope';
import { findShortesPath } from './findShortestPath';
import { pointsToSegments } from './pointsToSegments';

export class Grid {
  width: number;
  height: number;
  cost = new HashMap<Segment, number>(hashSegment);
  cells: Point[][];
  paths: Point[][] = [];

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.cells = Array.from({ length: height }, (_, y) => {
      return Array.from({ length: width }, (_, x) => {
        const point = { x, y };
        return point;
      });
    });
  }

  draw() {
    const CELL_SIZE = 20;
    const PADDING = 10;

    const canvas = document.createElement('canvas');
    canvas.width = this.width * CELL_SIZE + PADDING * 2;
    canvas.height = this.height * CELL_SIZE + PADDING * 2;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#333';

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        ctx.beginPath();
        ctx.arc(
          x * CELL_SIZE + PADDING,
          y * CELL_SIZE + PADDING,
          3,
          0,
          2 * Math.PI
        );
        ctx.fill();
      }
    }

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 4;

    for (const path of this.paths) {
      const segments = pointsToSegments(path);

      for (const segment of segments) {
        const polygon = createEnvelope(segment, 0.5, 4);

        ctx.fillStyle = `hsla(${Math.random() * 360}, 100%, 50%, 50%)`;
        ctx.beginPath();
        ctx.moveTo(
          polygon.points[0].x * CELL_SIZE + PADDING,
          polygon.points[0].y * CELL_SIZE + PADDING
        );
        for (const point of polygon.points) {
          ctx.lineTo(
            point.x * CELL_SIZE + PADDING,
            point.y * CELL_SIZE + PADDING
          );
        }
        ctx.fill();
      }
    }
  }

  generatePath(
    start: Point = this.getRandomCell(),
    end: Point = this.getRandomCell()
  ) {
    const path = findShortesPath(this, start, end);

    this.paths.push(path);

    for (let i = 0; i < path.length - 1; i++) {
      this.cost.set(
        {
          start: path[i],
          end: path[i + 1],
        },
        0.5
      );
    }
  }

  getRandomCell(): Point {
    const y = Math.floor(Math.random() * this.height);
    const x = Math.floor(Math.random() * this.width);
    return this.cells[y][x];
  }

  getCell(x: number, y: number) {
    const cell = this.cells[y][x];

    if (!cell) {
      throw new Error(`Cell at ${x}, ${y} does not exist.`);
    }

    return cell;
  }
}

function main() {
  const grid = new Grid(50, 50);

  for (let angle = 0; angle < 2 * Math.PI; angle += 0.3) {
    const circlePoint = grid.getCell(
      Math.round(25 + Math.cos(angle) * 20),
      Math.round(25 + Math.sin(angle) * 20)
    );

    grid.generatePath(grid.getCell(25, 25), circlePoint);

    grid.generatePath(circlePoint);
  }

  grid.draw();
}

main();
