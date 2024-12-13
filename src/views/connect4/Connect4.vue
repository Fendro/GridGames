<template>
  <div class="flex items-center justify-center">
    <Connect4Grid
      :grid="game.grid as Grid<Token>"
      :streak-cells="streakCells"
      @cell-click="
        (position) =>
          tryTo(() => game.play(position, new Token(game.currentPlayer)))
      "
    />
  </div>
</template>

<script lang="ts" setup>
import { Cell, Grid, Token } from '@/core/entities';
import { CellEvents, PlayerColor } from '@/core/enums';
import { buildConnect4 } from '@/core/usecases';
import Connect4Grid from '@/views/connect4/components/Connect4Grid.vue';
import { Ref, ref } from 'vue';
import { IObserver } from '@/core/interfaces';

const game = ref(
  buildConnect4({
    dimensions: {
      width: 7,
      height: 6,
      depth: 4,
    },
    players: [
      { name: 'Player 1', color: PlayerColor.Yellow, score: 0 },
      { name: 'Player 2', color: PlayerColor.Red, score: 0 },
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
</script>

<style scoped></style>
