import { Connect4, Player, Token } from '@/core/entities';
import { PlayerColor } from '@/core/constants';

export class Bot extends Player {
  public constructor(name: string, color: PlayerColor, score: number) {
    super(name, color, score);
  }

  public play(game: Connect4) {
    const randomCell =
      game.freeLowestCells[
        Math.floor(Math.random() * game.freeLowestCells.length)
      ];

    game.play(randomCell, new Token(this));
  }
}
