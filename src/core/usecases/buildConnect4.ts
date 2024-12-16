import { Bot, Connect4, Player } from '@/core/entities';
import { PlayerColor } from '@/core/constants';

export type PlayerType = 'player' | 'bot';

export interface PlayerOptions {
  name: string;
  color: PlayerColor;
  score: number;
  type: PlayerType;
}

export interface Connect4Options {
  dimensions: Dimensions;
  players: PlayerOptions[];
}

const playerConstructor: Record<
  PlayerType,
  new (name: string, color: PlayerColor, score: number) => Player
> = {
  player: Player,
  bot: Bot,
};

export const buildConnect4 = (options: Connect4Options) => {
  return new Connect4(
    options.dimensions,
    options.players.map(
      (p) => new playerConstructor[p.type](p.name, p.color, p.score),
    ),
    4,
  );
};
