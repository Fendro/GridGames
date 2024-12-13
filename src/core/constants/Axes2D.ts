import { Vector } from '@/core/entities';

const left = new Vector(-1, 0, 0);
const right = new Vector(1, 0, 0);
const up = new Vector(0, -1, 0);
const down = new Vector(0, 1, 0);
const upLeft = new Vector(-1, -1, 0);
const upRight = new Vector(1, -1, 0);
const downLeft = new Vector(-1, 1, 0);
const downRight = new Vector(1, 1, 0);

export const Axes2D: Axes = {
  horizontal: [left, right],
  vertical: [up, down],
  diagonalLeft: [upLeft, downRight],
  diagonalRight: [upRight, downLeft],
} as const;
