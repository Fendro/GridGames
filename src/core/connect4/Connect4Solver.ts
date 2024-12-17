import { Cell, Token } from '@/core/board';
import { Connect4 } from '@/core/connect4';
import { Axes2D, Axes3D } from '@/core/constants';
import { ITurnBasedGameSolver, Player } from '@/core/game';
import { Point, Vector } from '@/core/geometry';

export class Connect4Solver implements ITurnBasedGameSolver<Token> {
  private static readonly MINIMUM_STREAK_LENGTH = 1;

  public constructor(private readonly _game: Connect4) {}

  public getFavorableCells(player: Player): Cell<Token>[] {
    return this._game.playableCells.filter((cell) =>
      this.getStreaks(player, cell).some(
        (streak) => streak.length > Connect4Solver.MINIMUM_STREAK_LENGTH,
      ),
    );
  }

  public getPotentialWinningMoves(player: Player): Cell<Token>[] {
    return this._game.playableCells.filter((cell) =>
      this.isWinningMove(player, cell),
    );
  }

  public isWinningMove(player: Player, cell: Cell<Token>): boolean {
    return this.getWinningStreaks(player, cell).length > 0;
  }

  private getStreaks(player: Player, cell: Cell<Token>): Cell<Token>[][] {
    const axes = this.getAxisVectors();
    return axes.map((axis) => [
      cell,
      ...this.getStreaksOnAxis(player, cell.position, axis),
    ]);
  }

  private getWinningStreaks(
    player: Player,
    cell: Cell<Token>,
  ): Cell<Token>[][] {
    return this.getStreaks(player, cell).filter(
      (streak) => streak.length >= this._game.streakRequirement,
    );
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
