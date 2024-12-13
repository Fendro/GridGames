import { Point } from '@/core/entities/Point.ts';

export class Vector extends Point {
  public constructor(x: number, y: number, z: number) {
    super(x, y, z);
  }

  public add(vector: Vector) {
    this._x += vector.x;
    this._y += vector.y;
    this._z += vector.z;

    return this;
  }

  public sub(vector: Vector) {
    this._x -= vector.x;
    this._y -= vector.y;
    this._z -= vector.z;

    return this;
  }

  public mul(scalar: number) {
    this._x *= scalar;
    this._y *= scalar;
    this._z *= scalar;

    return this;
  }

  public div(scalar: number) {
    if (scalar === 0) {
      throw new Error('Division by zero');
    }

    this._x /= scalar;
    this._y /= scalar;
    this._z /= scalar;

    return this;
  }
}
