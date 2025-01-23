<template>
  <div class="flex items-center justify-center">
    <Connect4Grid
      :grid="game.grid as Grid<Token>"
      :streak-cells="streakCells"
      @cell-click="handleCellClick"
    />
  </div>
</template>

<script lang="ts" setup>
import { Ref, ref } from 'vue';
import Connect4Grid from '@/views/connect4/components/Connect4Grid.vue';
import { buildConnect4 } from '@/usecases';
import { Cell, Grid, Token } from '@/core/board';
import { CellEvents, PlayerColor } from '@/core/constants';
import { Point } from '@/core/geometry';
import { IObserver } from '@/core/interfaces';

const game = ref(
  buildConnect4({
    dimensions: {
      width: 7,
      height: 6,
      depth: 1,
    },
    players: [
      { name: 'Player 1', color: PlayerColor.Yellow, score: 0, type: 'player' },
      { name: 'Player 2', color: PlayerColor.Red, score: 0, type: 'bot' },
      // ...Object.values(PlayerColor)
      //   .slice(0, 4)
      //   .map(
      //     (color, index): PlayerOptions => ({
      //       name: `Bot ${index + 1}`,
      //       color,
      //       score: 0,
      //       type: 'bot',
      //     }),
      //   ),
    ],
  }),
);
const streakCells: Ref<Cell<Token>[]> = ref([]);
const streakHandler: IObserver<Cell<Token>> = {
  update: (streakCell) => streakCells.value.push(streakCell),
};
game.value.subscribe(CellEvents.Streak, streakHandler);

const tryTo = (func: () => void) => {
  try {
    func();
  } catch (e: unknown) {
    console.error(e);
  }
};

const handleCellClick = (position: Point) => {
  const lowestEmptyCell = game.value.getLowestEmptyCell(position);
  if (lowestEmptyCell === null) return;

  tryTo(() =>
    game.value.play(lowestEmptyCell, new Token(game.value.currentPlayer)),
  );
};
</script>

<style scoped></style>
