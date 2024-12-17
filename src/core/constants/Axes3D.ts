import { Vector } from '@/core/geometry';
import { Axes2D } from '@/core/constants/Axes2D.ts';

const above = new Vector(0, 0, -1);
const aboveFront = new Vector(0, -1, -1);
const aboveBack = new Vector(0, 1, -1);
const aboveRight = new Vector(1, 0, -1);
const aboveLeft = new Vector(-1, 0, -1);
const aboveFrontRight = new Vector(1, -1, -1);
const aboveFrontLeft = new Vector(-1, -1, -1);
const aboveBackRight = new Vector(1, 1, -1);
const aboveBackLeft = new Vector(-1, 1, -1);
const below = new Vector(0, 0, 1);
const belowFront = new Vector(0, -1, 1);
const belowBack = new Vector(0, 1, 1);
const belowRight = new Vector(1, 0, 1);
const belowLeft = new Vector(-1, 0, 1);
const belowFrontRight = new Vector(1, -1, 1);
const belowFrontLeft = new Vector(-1, -1, 1);
const belowBackRight = new Vector(1, 1, 1);
const belowBackLeft = new Vector(-1, 1, 1);

export const Axes3D: Axes = {
  crossLayer: [above, below],
  crossLayerFront: [aboveFront, belowBack],
  crossLayerFrontRight: [aboveFrontRight, belowBackLeft],
  crossLayerFrontLeft: [aboveFrontLeft, belowBackRight],
  crossLayerBack: [aboveBack, belowFront],
  crossLayerBackRight: [aboveBackRight, belowFrontLeft],
  crossLayerBackLeft: [aboveBackLeft, belowFrontRight],
  crossLayerRight: [aboveRight, belowLeft],
  crossLayerLeft: [aboveLeft, belowRight],
} as const;

Object.assign(Axes3D, Axes2D);
