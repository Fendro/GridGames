import {
  Cell,
  Grid,
  Player,
  Point,
  Token,
  TurnBasedGame,
  Vector,
} from '@/core/entities';
import { IObservable, IObserver } from '@/core/interfaces';
import { Axes3D, CellEvents } from '@/core/enums';
import { Axes2D } from '@/core/enums/Axes2D.ts';

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

    this._streakRequirement = streakRequirement;
  }

  private _streakRequirement: number;

  public get streakRequirement() {
    return this._streakRequirement;
  }

  public play(position: Point, token: Token) {
    if (this._isGameOver) return;

    const lowestEmptyCell = this.getLowestEmptyCell(position);
    if (!lowestEmptyCell) throw new Error('No empty cells in this column');

    lowestEmptyCell.value = token;
    this.notify(CellEvents.Occupied, lowestEmptyCell);

    if (this.hasWon(this.currentPlayer, lowestEmptyCell)) {
      console.log('Player', this.currentPlayer, 'won!');
      this._isGameOver = true;

      return;
    }

    this.nextTurn();
  }

  public subscribe(event: CellEvents, observer: IObserver<Cell<Token>>) {
    if (!this._cellObservers.has(event))
      this._cellObservers.set(event, new Set());

    this._cellObservers.get(event)!.add(observer);
  }

  public unsubscribe(event: CellEvents, observer: IObserver<Cell<Token>>) {
    this._cellObservers.get(event)?.delete(observer);
  }

  protected notify(event: CellEvents, subject: Cell<Token>): void {
    this._cellObservers
      .get(event)
      ?.forEach((observer) => observer.update(subject));
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
        'Streak requirement must be less than grid dimensions for 3D grids',
      );
  }

  private getLowestEmptyCell(position: Point) {
    const lowestCellPosition = new Vector(
      position.x,
      this.grid.dimensions.height - 1,
      position.z,
    );
    const direction = new Vector(0, -1, 0);

    while (this.grid.isWithinBounds(lowestCellPosition)) {
      const cell = this.grid.getCell(lowestCellPosition);
      if (cell.value === null) {
        return cell;
      }

      lowestCellPosition.add(direction);
    }

    return null;
  }

  private hasWon(player: Player, cell: Cell<Token>) {
    const axes = this.grid.is3D() ? Axes3D : Axes2D;
    const streaks = Object.values(axes).map((axis) => [
      cell,
      ...this.getStreakCellsOnAxis(player, cell.position, axis),
    ]);

    return streaks.some((streak) => {
      const isWinStreak = streak.length >= this.streakRequirement;

      if (isWinStreak)
        streak.forEach((streakCell) =>
          this.notify(CellEvents.Streak, streakCell),
        );

      return isWinStreak;
    });
  }

  private getStreakCellsOnAxis(
    player: Player,
    position: Point,
    axis: [Vector, Vector],
  ) {
    return axis
      .map((direction) =>
        this.getStreakCellsInDirection(player, position, direction),
      )
      .flat(1);
  }

  private getStreakCellsInDirection(
    player: Player,
    position: Point,
    direction: Vector,
  ) {
    const streak: Cell<Token>[] = [];
    const offset = new Vector(position.x, position.y, position.z).add(
      direction,
    );

    while (this.grid.isWithinBounds(offset)) {
      const cell = this.grid.getCell(offset);
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
