import { Cell, Token } from '@/core/board';
import { Player } from '@/core/game';

export interface ITurnBasedGameSolver<T extends Token> {
  getFavorableCells(player: Player): Cell<T>[];

  getPotentialWinningMoves(player: Player): Cell<T>[];

  isWinningMove(player: Player, cell: Cell<T>): boolean;
}
