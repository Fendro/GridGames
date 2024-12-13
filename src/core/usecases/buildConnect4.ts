import { Bot, Connect4, Player } from '@/core/entities';
import { PlayerColor } from '@/core/constants';

export interface Connect4Options {
  dimensions: Dimensions;
  players: Player[];
}

export const buildConnect4 = (options: Connect4Options) => {
  const players = Object.values(PlayerColor)
    .slice(0, 8)
    .map((color, index) => new Bot(`Bot ${index + 1}`, color, 0));

  return new Connect4(options.dimensions, players, 4);
};
