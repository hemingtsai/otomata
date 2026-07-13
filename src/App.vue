<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import Grid from "./components/Grid.vue";
import Controls from "./components/Controls.vue";
import SettingsDialog from "./components/SettingsDialog.vue";
import { useGrid } from "./composables/useGrid";

const {
  grid,
  timerSet,
  bpm,
  scaleId,
  handleCellClick,
  toggleTimer,
  clear,
  changeBpm,
  changeScale,
  toggleScaleNote,
  changeGridSize,
  flashingCells,
  selectedDir,
  setSelectedDir,
  gridSize,
  scaleNotes,
  selectedScaleNotes,
  hasPrePlay,
  restorePrePlay,
  saveToFile,
  loadFromFilePrompt,
} = useGrid();

const showSettings = ref(false);
function onKeyDown(e: KeyboardEvent) {
  if (e.code === "Space" && e.target === document.body) {
    e.preventDefault();
    toggleTimer();
  }
}

onMounted(() => {
  document.addEventListener("keydown", onKeyDown);
});

onUnmounted(() => {
  document.removeEventListener("keydown", onKeyDown);
});
</script>

<template>
  <div class="app">
    <header class="header">
      <h1 class="title">Otomata</h1>
      <span class="subtitle">A generative musical sequencer · By Earslap, Kunal Marwaha &amp; Hemingtsai</span>
    </header>

    <div class="layout">
      <div class="main-content">
        <Grid
          :grid="grid"
          :flashing-cells="flashingCells"
          :grid-size="gridSize"
          :scale-notes="scaleNotes"
          @cell-click="handleCellClick"
        />
      </div>

      <div class="controls-area">
        <Controls
          :timer-set="timerSet"
          :selected-dir="selectedDir"
          :has-pre-play="hasPrePlay"
          @toggle-timer="toggleTimer"
          @clear="clear"
          @select-dir="setSelectedDir"
          @open-settings="showSettings = true"
          @restore="restorePrePlay"
          @save="saveToFile"
          @load-file="loadFromFilePrompt"
        />
      </div>
    </div>

    <SettingsDialog
      v-if="showSettings"
      :bpm="bpm"
      :scale-id="scaleId"
      :grid-size="gridSize"
      :selected-scale-notes="selectedScaleNotes"
      :timer-set="timerSet"
      @close="showSettings = false"
      @change-bpm="changeBpm"
      @change-scale="changeScale"
      @change-grid-size="changeGridSize"
      @toggle-scale-note="toggleScaleNote"
    />
  </div>
</template>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 3vh 2vh 4vh;
  box-sizing: border-box;
}

.header {
  text-align: center;
  margin-bottom: 3vh;
}

.title {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: 2px;
}

.subtitle {
  font-size: 13px;
  color: var(--text-tertiary);
}

.layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2vh;
  width: 100%;
}

.main-content {
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.controls-area {
  display: flex;
  flex-direction: column;
  gap: 1vh;
  width: 100%;
  max-width: 400px;
}

/* Wide screen: grid left, controls right */
@media (min-width: 900px) {
  .layout {
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
  }

  .controls-area {
    width: 280px;
    max-width: 280px;
    flex-shrink: 0;
  }
}
</style>
