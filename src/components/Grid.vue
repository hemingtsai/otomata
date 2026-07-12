<script setup lang="ts">
import { GRID_SIZE } from "../constants";

defineProps<{
  grid: string[][];
  flashingCells: Set<string>;
}>();

defineEmits<{
  cellClick: [pos0: number, pos1: number];
}>();

function isFlashing(flashingCells: Set<string>, row: number, col: number): boolean {
  return flashingCells.has(`${row},${col}`);
}

function isFilled(grid: string[][], row: number, col: number): boolean {
  return !!grid[row][col];
}

function cellFontSize(val: string): string {
  const len = val.length;
  if (len <= 1) return "";
  if (len === 2) return "font-size: min(3vw, 3vh)";
  return "font-size: min(2.4vw, 2.4vh)";
}
</script>

<template>
  <table>
    <tbody>
      <tr v-for="(row, rowIdx) in grid" :key="rowIdx">
        <td
          v-for="(cellVal, colIdx) in row"
          :key="rowIdx * GRID_SIZE + colIdx"
          class="cell"
          :class="{
            filled: isFilled(grid, rowIdx, colIdx),
            flashing: isFlashing(flashingCells, rowIdx, colIdx) && !isFilled(grid, rowIdx, colIdx),
          }"
          :style="cellFontSize(cellVal)"
          @click="$emit('cellClick', colIdx, rowIdx)"
        >
          {{ cellVal }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
table {
  margin: auto;
  border: 2px solid var(--border-primary);
  border-collapse: collapse;
}

.cell {
  width: min(8vw, 8vh);
  height: min(8vw, 8vh);
  line-height: min(8vw, 8vh);
  cursor: pointer;
  font-size: min(4vw, 4vh);
  font-weight: bolder;
  border: 1px solid var(--border-secondary);
  text-align: center;
  vertical-align: middle;
  padding: 0;
  transition: background-color 0.05s ease;
  -webkit-tap-highlight-color: transparent;
  color: var(--text-tertiary);
}

.cell:not(.filled) {
  background-color: var(--bg-tertiary);
}

.cell.filled {
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

.cell.flashing:not(.filled) {
  background-color: var(--bg-secondary);
}
</style>
