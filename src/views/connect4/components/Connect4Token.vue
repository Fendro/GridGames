<template>
  <div :style="{ 'background-color': color }" class="size-full rounded-full" />
</template>

<script lang="ts" setup>
export interface Connect4TokenEmits {}

export interface Connect4TokenProps {
  color: string;
}

defineEmits<Connect4TokenEmits>();
defineProps<Connect4TokenProps>();
</script>

<style scoped></style>
