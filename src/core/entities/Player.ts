import { PlayerColor } from '@/core/enums';

export class Player implements Player {
  public constructor(
    public name: string,
    public color: PlayerColor,
    public score: number,
  ) {}
}
