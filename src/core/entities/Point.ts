export class Point {
  public constructor(
    protected _x: number,
    protected _y: number,
    protected _z: number,
  ) {}

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  get z() {
    return this._z;
  }
}
