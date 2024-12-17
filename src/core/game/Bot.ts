import { Cell, Token } from '@/core/board';
import { Connect4 } from '@/core/connect4';
import { PlayerColor } from '@/core/constants';
import { Player } from '@/core/game';
import { Vector } from '@/core/geometry';
import { ArrayUtils } from '@/utils';

export class Bot extends Player {
  public constructor(name: string, color: PlayerColor, score: number) {
    super(name, color, score);
  }

  public play(game: Connect4): void {
    if (this.tryWinningMove(game)) return;
    if (this.tryBlockingMove(game)) return;
    this.makeFavorableMove(game);
  }

  private tryWinningMove(game: Connect4): boolean {
    const winningCells = game.solver.getPotentialWinningMoves(this);
    if (winningCells.length > 0) {
      game.play(ArrayUtils.randomValue(winningCells), new Token(this));
      return true;
    }

    return false;
  }

  private tryBlockingMove(game: Connect4): boolean {
    const opponentWinningCells = game.solver.getPotentialWinningMoves(
      game.playersLap[1],
    );
    if (opponentWinningCells.length > 0) {
      game.play(ArrayUtils.randomValue(opponentWinningCells), new Token(this));
      return true;
    }

    return false;
  }

  private makeFavorableMove(game: Connect4): void {
    const favorableCells = game.solver
      .getFavorableCells(this)
      .filter((cell) => this.isSafeCellForMove(game, cell));

    const randomCell =
      favorableCells.length > 0
        ? ArrayUtils.randomValue(favorableCells)
        : ArrayUtils.randomValue(game.playableCells);

    game.play(randomCell, new Token(this));
  }

  private isSafeCellForMove(game: Connect4, cell: Cell<Token>): boolean {
    const upperCells = this.getUpperCells(game, cell);
    return (
      upperCells.length === 0 ||
      game.players
        .filter((player) => player !== this)
        .every((player) =>
          upperCells.every(
            (upperCell) => !game.solver.isWinningMove(player, upperCell),
          ),
        )
    );
  }

  private getUpperCells(game: Connect4, cell: Cell<Token>): Cell<Token>[] {
    const direction = new Vector(0, -1, 0);
    const upperCellPositions = Array.from(
      { length: game.grid.dimensions.depth },
      (_, i) => new Vector(cell.position.x, cell.position.y, i).add(direction),
    );

    return upperCellPositions
      .filter((position) => game.grid.isWithinBounds(position))
      .map((position) => game.grid.getCell(position));
  }
}
