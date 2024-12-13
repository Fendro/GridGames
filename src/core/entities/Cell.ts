import { Point, Token } from '@/core/entities';

export class Cell<T extends Token> {
  public constructor(
    public readonly position: Point,
    public value: T | null,
  ) {}

  public isOccupied() {
    return this.value !== null;
  }
}
