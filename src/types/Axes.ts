import { Vector } from '@/core/geometry';

declare global {
  export type Axes = Record<string, [Vector, Vector]>;
}
