import { Cell, Grid, Token } from '@/core/board';
import { Connect4Solver } from '@/core/connect4';
import { CellEvents } from '@/core/constants';
import { Bot, ITurnBasedGameSolver, Player, TurnBasedGame } from '@/core/game';
import { Point, Vector } from '@/core/geometry';
import { IObservable, IObserver } from '@/core/interfaces';

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

    this._solver = new Connect4Solver(this);
    this._streakRequirement = streakRequirement;

    this.updatePlayableCells();
    if (this._currentPlayer instanceof Bot) this._currentPlayer.play(this);
  }

  private _solver: ITurnBasedGameSolver<Token>;

  public get solver(): ITurnBasedGameSolver<Token> {
    return this._solver;
  }

  private _streakRequirement: number;

  public get streakRequirement(): number {
    return this._streakRequirement;
  }

  public play(cell: Cell<Token>, token: Token): void {
    if (this._isGameOver)
      throw new Error('Game is over. Cannot play more moves.');

    if (token.owner !== this._currentPlayer)
      throw new Error('It is not your turn.');

    cell.value = token;
    this.notify(CellEvents.Occupied, cell);

    if (
      this._solver.isWinningMove(token.owner, cell, (c) =>
        this.notify(CellEvents.Streak, c),
      )
    ) {
      this._isGameOver = true;
      this._currentPlayer.score++;

      console.log(this._currentPlayer, 'won!');
      return;
    }

    this.nextTurn();
  }

  public getLowestEmptyCell(position: Point): Cell<Token> | null {
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

  public subscribe(event: CellEvents, observer: IObserver<Cell<Token>>): void {
    if (!this._cellObservers.has(event))
      this._cellObservers.set(event, new Set());

    this._cellObservers.get(event)!.add(observer);
  }

  public unsubscribe(
    event: CellEvents,
    observer: IObserver<Cell<Token>>,
  ): void {
    this._cellObservers.get(event)?.delete(observer);
  }

  protected override nextTurn(): void {
    super.nextTurn();

    if (this._playableCells.length === 0) this._isGameOver = true;

    const currentPlayer = this._currentPlayer;
    if (!this._isGameOver && currentPlayer instanceof Bot) {
      setTimeout(() => {
        if (!this._isGameOver && currentPlayer === this._currentPlayer)
          currentPlayer.play(this);
      }, 100);
    }
  }

  protected notify(event: CellEvents, subject: Cell<Token>): void {
    this._cellObservers
      .get(event)
      ?.forEach((observer) => observer.update(subject));
  }

  protected override updatePlayableCells(): void {
    const playableCells: Cell<Token>[] = [];

    for (let z = 0; z < this._grid.dimensions.depth; z++) {
      for (let x = 0; x < this._grid.dimensions.width; x++) {
        const cell = this.getLowestEmptyCell(new Point(x, 0, z));
        if (cell !== null) playableCells.push(cell);
      }
    }

    this._playableCells = playableCells;
  }

  private ensureValidConfiguration(
    players: Player[],
    streakRequirement: number,
    dimensions: Dimensions,
  ): void {
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
    const necessaryCount = is3D ? 3 : 2;

    if (dimensionSatisfyingStreakCount < necessaryCount)
      throw new Error(
        'Streak requirement must be less or equal to grid dimensions for 3D grids',
      );
  }
}
