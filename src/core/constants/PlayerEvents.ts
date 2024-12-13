export const PlayerEvents = {
  Won: 'won',
  Lost: 'lost',
} as const;

export type PlayerEvents = (typeof PlayerEvents)[keyof typeof PlayerEvents];
