import { Connect4, Player } from '@/core/entities';

export interface Connect4Options {
  dimensions: Dimensions;
  players: Player[];
}

export const buildConnect4 = (options: Connect4Options) => {
  const players = options.players.map(
    (p) => new Player(p.name, p.color, p.score),
  );

  return new Connect4(options.dimensions, players, 4);
};
