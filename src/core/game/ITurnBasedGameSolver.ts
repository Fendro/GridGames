import { Cell, Token } from '@/core/board';
import { Player } from '@/core/game';

export interface ITurnBasedGameSolver<T extends Token> {
  getFavorableCells(player: Player): Cell<T>[];

  getPotentialWinningMoves(player: Player): Cell<T>[];

  // TODO: Remove the callback argument and find a better implementation to propagate events
  isWinningMove(
    player: Player,
    cell: Cell<T>,
    cb: ((c: Cell<T>) => void) | null,
  ): boolean;
}
