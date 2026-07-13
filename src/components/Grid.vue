<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  grid: string[][];
  flashingCells: Set<string>;
  gridSize: number;
  scaleNotes: string[];
}>();

defineEmits<{
  cellClick: [pos0: number, pos1: number];
}>();

const cellSize = computed(() => {
  const cols = props.gridSize + 1;
  const sizeW = 80 / cols;
  const sizeH = 70 / cols;
  return `min(${sizeW}vw, ${sizeH}vh)`;
});

const cellFont = computed(() => {
  const cols = props.gridSize + 1;
  const sizeW = 40 / cols;
  const sizeH = 40 / cols;
  return `min(${sizeW}vw, ${sizeH}vh)`;
});

const labelFont = computed(() => {
  const cols = props.gridSize + 1;
  const sizeW = 18 / cols;
  const sizeH = 18 / cols;
  return `min(${sizeW}vw, ${sizeH}vh)`;
});

function isFlashing(flashingCells: Set<string>, row: number, col: number): boolean {
  return flashingCells.has(`${row},${col}`);
}

function isFilled(grid: string[][], row: number, col: number): boolean {
  return !!grid[row][col];
}

function cellFontSize(val: string): string {
  const len = val.length;
  if (len <= 1) return "";
  const cols = props.gridSize + 1;
  const s = len === 2 ? 30 : 24;
  const sizeW = s / cols;
  const sizeH = s / cols;
  return `font-size: min(${sizeW}vw, ${sizeH}vh)`;
}
</script>

<template>
  <table :style="{ '--cell-size': cellSize, '--cell-font': cellFont, '--label-font': labelFont }">
    <thead>
      <tr>
        <th class="corner"></th>
        <th v-for="(note, colIdx) in scaleNotes" :key="'h' + colIdx" class="header-cell">
          {{ note }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, rowIdx) in grid" :key="rowIdx">
        <td class="row-label">{{ scaleNotes[gridSize - 1 - rowIdx] }}</td>
        <td
          v-for="(cellVal, colIdx) in row"
          :key="rowIdx * gridSize + colIdx"
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

.corner {
  border: none;
  background: transparent;
}

.header-cell,
.row-label {
  font-size: var(--label-font);
  color: var(--text-tertiary);
  text-align: center;
  vertical-align: middle;
  padding: 0 1px;
  font-weight: 400;
}

.cell {
  width: var(--cell-size);
  height: var(--cell-size);
  line-height: var(--cell-size);
  cursor: pointer;
  font-size: var(--cell-font);
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
