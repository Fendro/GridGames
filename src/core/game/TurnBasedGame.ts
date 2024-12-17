import { Cell, Grid, Token } from '@/core/board';
import { Player } from '@/core/game';

export abstract class TurnBasedGame<T extends Token> {
  protected constructor(grid: Grid<T>, players: Player[]) {
    this._currentPlayer = players[0];
    this._grid = grid;
    this._isGameOver = false;
    this._playableCells = [];
    this._players = players;
    this._playersLap = [...players];
    this._turn = 0;
  }

  protected _currentPlayer: Player;

  public get currentPlayer(): Player {
    return this._currentPlayer;
  }

  protected _grid: Grid<T>;

  public get grid(): Grid<T> {
    return this._grid;
  }

  protected _isGameOver: boolean;

  public get isGameOver(): boolean {
    return this._isGameOver;
  }

  protected _playableCells: Cell<Token>[];

  public get playableCells(): ReadonlyArray<Cell<Token>> {
    return this._playableCells;
  }

  protected _players: Player[];

  public get players(): ReadonlyArray<Player> {
    return this._players;
  }

  protected _playersLap: Player[];

  public get playersLap(): ReadonlyArray<Player> {
    return this._playersLap;
  }

  protected _turn: number;

  public get turn(): number {
    return this._turn;
  }

  public registerPlayer(player: Player): void {
    if (this._players.some((p) => p.name === player.name)) {
      throw new Error(`Player ${player.name} already registered`);
    }

    this._players.push(player);
  }

  public unregisterPlayer(player: Player): void {
    this._players = this._players.filter((p) => p.name !== player.name);
  }

  public abstract play(cell: Cell<Token>, token: T): void;

  protected nextTurn(): void {
    this._turn++;
    this.updatePlayableCells();
    this.updatePlayersLap();
    this.updateCurrentPlayer();
  }

  protected updateCurrentPlayer(): void {
    this._currentPlayer = this._playersLap[0];
  }

  protected abstract updatePlayableCells(): void;

  protected updatePlayersLap(): void {
    const currentPlayerIndex = this._players.indexOf(this._currentPlayer);

    this._playersLap = [
      ...this._players.slice(currentPlayerIndex + 1),
      ...this._players.slice(0, currentPlayerIndex),
      this._currentPlayer,
    ];
  }
}
