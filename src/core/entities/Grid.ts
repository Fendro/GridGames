import { Cell, Point, Token } from '@/core/entities';

export class Grid<T extends Token> {
  public readonly cells: Cell<T>[][][];

  public constructor(public dimensions: Dimensions) {
    this.cells = new Array(dimensions.depth);

    for (let z = 0; z < dimensions.depth; z++) {
      this.cells[z] = new Array(dimensions.height);

      for (let y = 0; y < dimensions.height; y++) {
        this.cells[z][y] = new Array(dimensions.width);

        for (let x = 0; x < dimensions.width; x++) {
          this.cells[z][y][x] = new Cell<T>(new Point(x, y, z), null);
        }
      }
    }
  }

  public getCell(position: Point) {
    return this.cells[position.z][position.y][position.x];
  }

  public getColumn(position: Point) {
    return this.cells[position.z].map((row) => row[position.x]);
  }

  public getLayer(position: Point) {
    return this.cells[position.z];
  }

  public getRow(position: Point) {
    return this.cells[position.z][position.y];
  }

  public isWithinBounds(position: Point) {
    return (
      position.x >= 0 &&
      position.x < this.dimensions.width &&
      position.y >= 0 &&
      position.y < this.dimensions.height &&
      position.z >= 0 &&
      position.z < this.dimensions.depth
    );
  }

  public toString() {
    return this.cells
      .map((row) =>
        row
          .map((col) =>
            col.map((cell) => cell.value?.owner.name ?? 'null').join(','),
          )
          .join('\n'),
      )
      .join('\n');
  }
}
