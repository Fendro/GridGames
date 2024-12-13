export const CellEvents = {
  Occupied: 'occupied',
  Freed: 'freed',
  Streak: 'streak',
} as const;

export type CellEvents = (typeof CellEvents)[keyof typeof CellEvents];
