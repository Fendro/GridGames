import {
  Bot,
  Cell,
  Grid,
  Player,
  Point,
  Token,
  TurnBasedGame,
  Vector,
} from '@/core/entities';
import { IObservable, IObserver } from '@/core/interfaces';
import { Axes3D, CellEvents } from '@/core/constants';
import { Axes2D } from '@/core/constants/Axes2D.ts';

export class Connect4
  extends TurnBasedGame<Token>
  implements IObservable<CellEvents, Cell<Token>>
{
  private _cellObservers: Map<CellEvents, Set<IObserver<Cell<Token>>>> =
    new Map();

  public constructor(
    dimensions: Dimensions,
    players: Player[],
    streakRequirement: number,
  ) {
    super(new Grid<Token>(dimensions), players);
    this.ensureValidConfiguration(players, streakRequirement, dimensions);

    this._freeLowestCells = [];
    this.updateFreeLowestCells();
    this._streakRequirement = streakRequirement;

    if (this._currentPlayer instanceof Bot) this._currentPlayer.play(this);
  }

  private _freeLowestCells: Cell<Token>[];

  public get freeLowestCells(): ReadonlyArray<Cell<Token>> {
    return this._freeLowestCells;
  }

  private _streakRequirement: number;

  public get streakRequirement() {
    return this._streakRequirement;
  }

  public get nextPlayerTurnLap() {
    const currentIndex = this._players.indexOf(this._currentPlayer);
    return [
      ...this._players.slice(currentIndex + 1),
      ...this._players.slice(0, currentIndex),
      this._currentPlayer,
    ];
  }

  public isWinningPlay(cell: Cell<Token>, token: Token) {
    return this.getWinningStreaks(cell, token.owner).length > 0;
  }

  public play(cell: Cell<Token>, token: Token) {
    if (this._isGameOver)
      throw new Error('Game is over. Cannot play more moves.');

    if (token.owner !== this._currentPlayer)
      throw new Error('It is not your turn.');

    cell.value = token;
    this.notify(CellEvents.Occupied, cell);

    const winningStreaks = this.getWinningStreaks(cell, token.owner);

    if (winningStreaks.length > 0) {
      winningStreaks
        .flat(1)
        .forEach((streakCell) => this.notify(CellEvents.Streak, streakCell));
      this._isGameOver = true;
      this._currentPlayer.score++;

      console.log(this._currentPlayer, 'won!');
      console.log('Streak requirement: ', this._streakRequirement);
      console.log('StreakCells: ', winningStreaks);
      return;
    }

    this.nextTurn();
  }

  public getLowestEmptyCell(position: Point) {
    const lowestCellPosition = new Vector(
      position.x,
      this._grid.dimensions.height - 1,
      position.z,
    );
    const direction = new Vector(0, -1, 0);

    while (this._grid.isWithinBounds(lowestCellPosition)) {
      const cell = this._grid.getCell(lowestCellPosition);
      if (cell.value === null) {
        return cell;
      }

      lowestCellPosition.add(direction);
    }

    return null;
  }

  public subscribe(event: CellEvents, observer: IObserver<Cell<Token>>) {
    if (!this._cellObservers.has(event))
      this._cellObservers.set(event, new Set());

    this._cellObservers.get(event)!.add(observer);
  }

  public unsubscribe(event: CellEvents, observer: IObserver<Cell<Token>>) {
    this._cellObservers.get(event)?.delete(observer);
  }

  public getStreaks(cell: Cell<Token>, player: Player) {
    return Object.values(this._grid.is3D() ? Axes3D : Axes2D).map((axis) => [
      cell,
      ...this.getStreaksOnAxis(player, cell.position, axis),
    ]);
  }

  protected nextTurn() {
    super.nextTurn();
    this.updateFreeLowestCells();

    if (this._freeLowestCells.length === 0) this._isGameOver = true;

    if (!this._isGameOver && this._currentPlayer instanceof Bot) {
      setTimeout(() => {
        if (!this._isGameOver && this._currentPlayer instanceof Bot)
          this._currentPlayer.play(this);
      }, 50);
    }
  }

  protected notify(event: CellEvents, subject: Cell<Token>) {
    this._cellObservers
      .get(event)
      ?.forEach((observer) => observer.update(subject));
  }

  private updateFreeLowestCells() {
    const freeLowestCells: Cell<Token>[] = [];

    for (let z = 0; z < this._grid.dimensions.depth; z++) {
      for (let x = 0; x < this._grid.dimensions.width; x++) {
        const freeCell = this.getLowestEmptyCell(new Point(x, 0, z));
        if (freeCell !== null) freeLowestCells.push(freeCell);
      }
    }

    this._freeLowestCells = freeLowestCells;
  }

  private ensureValidConfiguration(
    players: Player[],
    streakRequirement: number,
    dimensions: Dimensions,
  ) {
    if (players.length < 2) throw new Error('At least 2 players are required');

    if (streakRequirement < 2)
      throw new Error('Streak requirement must be greater than 1');

    const dimensionsValues = Object.values(dimensions);
    if (dimensionsValues.some((d) => d < 1))
      throw new Error('Dimensions must be greater than 0');

    const dimensionSatisfyingStreakCount = dimensionsValues.filter(
      (d) => d >= streakRequirement,
    ).length;
    const is3D = dimensionsValues.every((d) => d > 1);
    const validDimensionCount = is3D ? 3 : 2;

    if (dimensionSatisfyingStreakCount < validDimensionCount)
      throw new Error(
        'Streak requirement must be less or equal to grid dimensions for 3D grids',
      );
  }

  private getWinningStreaks(cell: Cell<Token>, player: Player) {
    return this.getStreaks(cell, player).filter(
      (streak) => streak.length >= this.streakRequirement,
    );
  }

  private getStreaksOnAxis(
    player: Player,
    position: Point,
    axis: [Vector, Vector],
  ) {
    return axis
      .map((direction) =>
        this.getStreakInDirection(player, position, direction),
      )
      .flat(1);
  }

  private getStreakInDirection(
    player: Player,
    position: Point,
    direction: Vector,
  ) {
    const streak: Cell<Token>[] = [];
    const offset = new Vector(position.x, position.y, position.z).add(
      direction,
    );

    while (this._grid.isWithinBounds(offset)) {
      const cell = this._grid.getCell(offset);
      if (cell.value?.owner === player) {
        streak.push(cell);
        offset.add(direction);
      } else {
        break;
      }
    }

    return streak;
  }
}
