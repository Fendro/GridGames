<template>
  <div class="flex size-min flex-col gap-2">
    <div
      v-for="(layer, z) in grid.cells"
      :style="{ 'background-color': PlayerColor.Blue }"
      class="flex flex-col border-2 border-black"
    >
      <div v-for="(row, y) in layer" class="flex flex-row">
        <div
          v-for="(cell, x) in row"
          class="m-1 size-16 rounded-full border-2 border-black bg-white"
          @click="$emit('cell-click', new Point(x, y, z))"
        >
          <template v-if="cell.value">
            <Connect4Token
              :class="{ spin: streakCells.includes(cell) }"
              :color="cell.value.owner.color"
            />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Connect4Token from '@/views/connect4/components/Connect4Token.vue';
import { Cell, Grid, Token } from '@/core/board';
import { PlayerColor } from '@/core/constants';
import { Point } from '@/core/geometry';

export interface Connect4GridEmits {
  (e: 'cell-click', position: Point): void;
}

export interface Connect4GridProps {
  grid: Grid<Token>;
  streakCells: Cell<Token>[];
}

defineEmits<Connect4GridEmits>();
defineProps<Connect4GridProps>();
</script>

<style scoped>
@keyframes spinY {
  0% {
    transform: rotateY(0deg);
  }
  100% {
    transform: rotateY(360deg);
  }
}

.spin {
  animation: spinY 2s linear infinite;
  transform-style: preserve-3d;
  perspective: 1000px;
}
</style>
