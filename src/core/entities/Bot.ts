import { Cell, Connect4, Player, Token, Vector } from '@/core/entities';
import { PlayerColor } from '@/core/constants';

export class Bot extends Player {
  public constructor(name: string, color: PlayerColor, score: number) {
    super(name, color, score);
  }

  public play(game: Connect4) {
    const winningCells = this.getPotentialWinningMoves(game);
    if (winningCells.length > 0) {
      game.play(this.randomValue(winningCells), new Token(this));
      return;
    }

    const nextPlayerWinningCells = this.getNextPlayerWinningMoves(game);
    if (nextPlayerWinningCells.length > 0) {
      game.play(this.randomValue(nextPlayerWinningCells), new Token(this));
      return;
    }

    let favorableCells = this.getFavorableCells(game);
    favorableCells = favorableCells.filter(
      this.doesNotBenefitAnotherPlayer(game),
    );

    const randomCell =
      favorableCells.length > 0
        ? this.randomValue(favorableCells)
        : this.randomValue(game.freeLowestCells);

    game.play(randomCell, new Token(this));
  }

  private doesNotBenefitAnotherPlayer(game: Connect4) {
    return (cell: Cell<Token>) => {
      let upperNeighbouringCellPositions: Vector[] = [];
      const direction = new Vector(0, -1, 0);
      for (let i = 0; i < game.grid.dimensions.depth; i++) {
        upperNeighbouringCellPositions.push(
          new Vector(cell.position.x, cell.position.y, i).add(direction),
        );
      }
      upperNeighbouringCellPositions = upperNeighbouringCellPositions.filter(
        (position) => game.grid.isWithinBounds(position),
      );

      if (upperNeighbouringCellPositions.length === 0) return true;

      return game.players
        .filter((player) => player !== this)
        .every((player) =>
          upperNeighbouringCellPositions.every(
            (position) =>
              !game.isWinningMove(
                game.grid.getCell(position),
                new Token(player),
              ),
          ),
        );
    };
  }

  private getPotentialWinningMoves(game: Connect4) {
    return game.freeLowestCells.filter((cell) =>
      game.isWinningMove(cell, new Token(this)),
    );
  }

  private getNextPlayerWinningMoves(game: Connect4) {
    return game.freeLowestCells.filter((cell) =>
      game.isWinningMove(cell, new Token(game.nextPlayerTurnLap[0])),
    );
  }

  private getFavorableCells(game: Connect4) {
    return game.freeLowestCells.filter((cell) =>
      game.getStreaks(cell, this).some((streak) => streak.length > 1),
    );
  }

  private randomValue<T>(array: ReadonlyArray<T>) {
    return array[Math.floor(Math.random() * array.length)];
  }
}
