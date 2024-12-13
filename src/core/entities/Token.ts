import { Player } from '@/core/entities';

export class Token {
  public constructor(private _owner: Player) {}

  public get owner() {
    return this._owner;
  }
}
