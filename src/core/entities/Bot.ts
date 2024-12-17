import { Cell, Connect4, Player, Token, Vector } from '@/core/entities';
import { PlayerColor } from '@/core/constants';
import { ArrayUtils } from '@/core/utils';

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
      game.nextPlayerTurnLap[0],
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
        : ArrayUtils.randomValue(game.freeLowestCells);

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
            (upperCell) => !game.solver.isWinningMove(upperCell, player),
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
