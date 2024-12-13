import { Vector } from '@/core/entities';

declare global {
  export type Axes = Record<string, [Vector, Vector]>;
}
