import { Player } from '@/core/game';

export class Token {
  public constructor(protected _owner: Player) {}

  public get owner() {
    return this._owner;
  }
}
