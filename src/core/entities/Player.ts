import { PlayerColor } from '@/core/constants';

export class Player implements Player {
  public constructor(
    public name: string,
    public color: PlayerColor,
    public score: number,
  ) {}
}
