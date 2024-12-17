import { Cell, Connect4, Player, Point, Token, Vector } from '@/core/entities';
import { Axes2D, Axes3D } from '@/core/constants';

export class Solver {
  private static readonly MINIMUM_STREAK_LENGTH = 1;

  public constructor(private readonly _game: Connect4) {}

  public getFavorableCells(player: Player): Cell<Token>[] {
    return this._game.freeLowestCells.filter((cell) =>
      this.getStreaks(cell, player).some(
        (streak) => streak.length > Solver.MINIMUM_STREAK_LENGTH,
      ),
    );
  }

  public getPotentialWinningMoves(player: Player): Cell<Token>[] {
    return this._game.freeLowestCells.filter((cell) =>
      this.isWinningMove(cell, player),
    );
  }

  public getStreaks(cell: Cell<Token>, player: Player): Cell<Token>[][] {
    const axes = this.getAxisVectors();
    return axes.map((axis) => [
      cell,
      ...this.getStreaksOnAxis(player, cell.position, axis),
    ]);
  }

  public getWinningStreaks(cell: Cell<Token>, player: Player): Cell<Token>[][] {
    return this.getStreaks(cell, player).filter(
      (streak) => streak.length >= this._game.streakRequirement,
    );
  }

  public isWinningMove(cell: Cell<Token>, player: Player): boolean {
    return this.getWinningStreaks(cell, player).length > 0;
  }

  private getStreaksOnAxis(
    player: Player,
    position: Point,
    axis: [Vector, Vector],
  ): Cell<Token>[] {
    return axis.flatMap((direction) =>
      this.getStreakInDirection(player, position, direction),
    );
  }

  private getStreakInDirection(
    player: Player,
    position: Point,
    direction: Vector,
  ): Cell<Token>[] {
    const streak: Cell<Token>[] = [];
    const offset = new Vector(position.x, position.y, position.z).add(
      direction,
    );

    while (this._game.grid.isWithinBounds(offset)) {
      const cell = this._game.grid.getCell(offset);
      if (cell.value?.owner === player) {
        streak.push(cell);
        offset.add(direction);
      } else {
        break;
      }
    }

    return streak;
  }

  private getAxisVectors(): [Vector, Vector][] {
    return Object.values(this._game.grid.is3D() ? Axes3D : Axes2D);
  }
}
