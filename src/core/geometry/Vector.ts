import { Point } from '@/core/geometry/Point.ts';

export class Vector extends Point {
  public constructor(x: number, y: number, z: number) {
    super(x, y, z);
  }

  public get length() {
    return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z);
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

  public rotateXY(angle: number) {
    this.rotate('_x', '_y', angle);
  }

  public rotateXZ(angle: number) {
    this.rotate('_x', '_z', angle);
  }

  public rotateYZ(angle: number) {
    this.rotate('_y', '_z', angle);
  }

  private rotate(
    axis1: '_x' | '_y' | '_z',
    axis2: '_x' | '_y' | '_z',
    angle: number,
  ) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    const a = this[axis1];
    const b = this[axis2];

    this[axis1] = cos * a - sin * b;
    this[axis2] = sin * a + cos * b;
  }
}
