import { Grid, Player, Point, Token } from '@/core/entities';

export abstract class TurnBasedGame<T extends Token> {
  protected constructor(
    protected _grid: Grid<T>,
    protected _players: Player[],
  ) {
    this._currentPlayer = _players[0];
    this._isGameOver = false;
    this._turn = 0;
  }

  protected _isGameOver: boolean;

  public get isGameOver() {
    return this._isGameOver;
  }

  public get grid() {
    return this._grid;
  }

  public get players(): ReadonlyArray<Player> {
    return this._players;
  }

  protected _currentPlayer: Player;

  public get currentPlayer() {
    return this._currentPlayer;
  }

  private _turn: number;

  public get turn(): number {
    return this._turn;
  }

  public registerPlayer(player: Player) {
    if (this._players.some((p) => p.name === player.name)) {
      throw new Error(`Player ${player.name} already registered`);
    }

    this._players.push(player);
  }

  public unregisterPlayer(player: Player) {
    this._players = this._players.filter((p) => p.name !== player.name);
  }

  public abstract play(position: Point, token: T): void;

  protected nextTurn() {
    this._turn++;
    this._currentPlayer = this._players[this._turn % this._players.length];
  }
}
