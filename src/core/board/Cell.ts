import { Token } from '@/core/board';
import { Point } from '@/core/geometry';

export class Cell<T extends Token> {
  public constructor(
    public readonly position: Point,
    public value: T | null,
  ) {}

  public isOccupied() {
    return this.value !== null;
  }
}
