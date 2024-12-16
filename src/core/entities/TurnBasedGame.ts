import { Cell, Grid, Player, Token } from '@/core/entities';

export abstract class TurnBasedGame<T extends Token> {
  protected constructor(
    protected _grid: Grid<T>,
    protected _players: Player[],
  ) {
    this._currentPlayer = _players[0];
    this._isGameOver = false;
    this._playersLap = [..._players];
    this._turn = 0;
  }

  protected _currentPlayer: Player;

  public get currentPlayer() {
    return this._currentPlayer;
  }

  protected _isGameOver: boolean;

  public get isGameOver() {
    return this._isGameOver;
  }

  protected _playersLap: Player[];

  public get playersLap() {
    return this._playersLap;
  }

  protected _turn: number;

  public get turn(): number {
    return this._turn;
  }

  public get grid() {
    return this._grid;
  }

  public get players(): ReadonlyArray<Player> {
    return this._players;
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

  public abstract play(cell: Cell<Token>, token: T): void;

  protected nextTurn() {
    this._turn++;
    this.updatePlayersLap();
    this.updateCurrentPlayer();
  }

  protected updatePlayersLap() {
    const currentPlayerIndex = this._players.indexOf(this._currentPlayer);

    this._playersLap = [
      ...this._players.slice(currentPlayerIndex + 1),
      ...this._players.slice(0, currentPlayerIndex),
      this._currentPlayer,
    ];
  }

  protected updateCurrentPlayer() {
    this._currentPlayer = this._playersLap[0];
  }
}
