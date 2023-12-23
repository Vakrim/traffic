import { Grid } from './grid';
import { Point } from './Point';

export function findShortesPath(grid: Grid, start: Point, end: Point) {
  const openSet = [start];
  const closedSet = [];
  const cameFrom = new Map<Point, Point>();
  const cellCost = new Map<Point, number>();

  cellCost.set(start, 0);

  while (openSet.length > 0) {
    const current = getLowestCost(openSet, cellCost);
    if (current === end) {
      return reconstructPath(cameFrom, current);
    }

    openSet.splice(openSet.indexOf(current), 1);
    closedSet.push(current);

    for (const neighbor of getNeighbors(grid, current)) {
      if (closedSet.includes(neighbor)) {
        continue;
      }

      const isDiagonal = neighbor.x !== current.x && neighbor.y !== current.y;
      const score =
        cellCost.get(current)! +
        (grid.cost.get({
          start: current,
          end: neighbor,
        }) ?? 1) *
          (isDiagonal ? 1.4 : 1);

      if (!openSet.includes(neighbor)) {
        openSet.push(neighbor);
      } else if (score >= cellCost.get(neighbor)!) {
        continue;
      }

      cameFrom.set(neighbor, current);
      cellCost.set(neighbor, score);
    }
  }

  return [];
}

function getLowestCost(cells: Point[], cost: Map<Point, number>): Point {
  let lowest = cells[0];
  let lowestCost = cost.get(lowest)!;

  for (const cell of cells) {
    const score = cost.get(cell)!;
    if (score < lowestCost) {
      lowest = cell;
      lowestCost = score;
    }
  }

  return lowest;
}

function reconstructPath(cameFrom: Map<Point, Point>, current: Point) {
  const path = [current];

  while (cameFrom.has(current)) {
    current = cameFrom.get(current)!;
    path.unshift(current);
  }

  return path;
}

function getNeighbors(grid: Grid, cell: Point): Point[] {
  const { x, y } = cell;
  const neighbors = [];

  if (x > 0) {
    neighbors.push(grid.cells[y][x - 1]);
  }

  if (x < grid.width - 1) {
    neighbors.push(grid.cells[y][x + 1]);
  }

  if (y > 0) {
    neighbors.push(grid.cells[y - 1][x]);
  }

  if (y < grid.height - 1) {
    neighbors.push(grid.cells[y + 1][x]);
  }

  if (x > 0 && y > 0) {
    neighbors.push(grid.cells[y - 1][x - 1]);
  }

  if (x < grid.width - 1 && y > 0) {
    neighbors.push(grid.cells[y - 1][x + 1]);
  }

  if (x > 0 && y < grid.height - 1) {
    neighbors.push(grid.cells[y + 1][x - 1]);
  }

  if (x < grid.width - 1 && y < grid.height - 1) {
    neighbors.push(grid.cells[y + 1][x + 1]);
  }

  return neighbors;
}
