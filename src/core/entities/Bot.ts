import { Connect4, Player, Token } from '@/core/entities';
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

    const favorableCells = this.getFavorableCells(game);
    const randomCell =
      favorableCells.length > 0
        ? this.randomValue(favorableCells)
        : this.randomValue(game.freeLowestCells);

    game.play(randomCell, new Token(this));
  }

  private getPotentialWinningMoves(game: Connect4) {
    return game.freeLowestCells.filter((cell) =>
      game.isWinningPlay(cell, new Token(this)),
    );
  }

  private getNextPlayerWinningMoves(game: Connect4) {
    return game.freeLowestCells.filter((cell) =>
      game.isWinningPlay(cell, new Token(game.nextPlayerTurnLap[0])),
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
