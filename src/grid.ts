import { Point } from './Point';
import { findShortesPath } from './findShortestPath';
import { pointsToSegments } from './pointsToSegments';

export class Grid {
  width: number;
  height: number;
  cost = new Map<Point, number>();
  cells: Point[][];
  paths: Point[][] = [];

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.cells = Array.from({ length: height }, (_, y) => {
      return Array.from({ length: width }, (_, x) => {
        const point = { x, y };
        this.cost.set(point, 1);
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
      ctx.beginPath();
      ctx.moveTo(
        path[0].x * CELL_SIZE + PADDING,
        path[0].y * CELL_SIZE + PADDING
      );
      for (const cell of path) {
        ctx.lineTo(cell.x * CELL_SIZE + PADDING, cell.y * CELL_SIZE + PADDING);
      }
      ctx.stroke();

      const segments = pointsToSegments(path);

      for (const segment of segments) {
        ctx.strokeStyle = `hsl(${Math.random() * 360}, 100%, 50%)`;
        ctx.beginPath();
        ctx.moveTo(
          segment.start.x * CELL_SIZE + PADDING,
          segment.start.y * CELL_SIZE + PADDING
        );
        ctx.lineTo(
          segment.end.x * CELL_SIZE + PADDING,
          segment.end.y * CELL_SIZE + PADDING
        );
        ctx.stroke();
      }
    }
  }

  generatePath(
    start: Point = this.getRandomCell(),
    end: Point = this.getRandomCell()
  ) {
    const path = findShortesPath(this, start, end);

    this.paths.push(path);

    for (const cell of path) {
      this.cost.set(cell, 0.5);
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