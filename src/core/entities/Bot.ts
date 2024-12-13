import { Player } from '@/core/entities';
import { PlayerColor } from '@/core/enums';

export class Bot extends Player {
  public constructor(name: string, color: PlayerColor, score: number) {
    super(name, color, score);
  }
}
