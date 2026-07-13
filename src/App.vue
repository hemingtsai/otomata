<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import Grid from "./components/Grid.vue";
import Controls from "./components/Controls.vue";
import SettingsDialog from "./components/SettingsDialog.vue";
import Button from "./components/Button.vue";
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
  getURL,
  loadFromQuery,
  flashingCells,
  selectedDir,
  setSelectedDir,
  gridSize,
  scaleNotes,
  selectedScaleNotes,
  hasPrePlay,
  restorePrePlay,
  saveToFile,
  loadFromFile,
} = useGrid();

const showUrl = ref(false);
const showSettings = ref(false);
const currentUrl = ref("");

function onGetURL() {
  currentUrl.value = getURL();
  showUrl.value = true;
}

function copyURL() {
  navigator.clipboard.writeText(currentUrl.value).catch(() => {
    // Fallback: select the text
    const textarea = document.createElement("textarea");
    textarea.value = currentUrl.value;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  });
}

function onLoad(url: string) {
  loadFromQuery(url);
}

const fileInput = ref<HTMLInputElement>();
function triggerLoad() {
  fileInput.value?.click();
}
function onLoadFile(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    if (!loadFromFile(reader.result as string)) alert("Invalid save file");
  };
  reader.readAsText(file);
  input.value = "";
}

// Space bar toggle
function onKeyDown(e: KeyboardEvent) {
  if (e.code === "Space" && e.target === document.body) {
    e.preventDefault();
    toggleTimer();
  }
}

onMounted(() => {
  document.addEventListener("keydown", onKeyDown);

  // Load URL from query string if present
  const search = window.location.search;
  if (search) {
    loadFromQuery(search);
  }
});

onUnmounted(() => {
  document.removeEventListener("keydown", onKeyDown);
});
</script>

<template>
  <div class="app">
    <header class="header">
      <h1 class="title">Otomata</h1>
      <span class="subtitle">A generative musical sequencer</span>
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
          @load-file="triggerLoad"
          @load-url="onLoad"
        />
        <div class="url-row">
          <Button @click="onGetURL">Get URL</Button>
        </div>
      </div>
    </div>

    <!-- URL overlay -->
    <div v-if="showUrl" class="overlay" @click.self="showUrl = false">
      <div class="url-dialog">
        <p class="url-label">Share this URL:</p>
        <textarea readonly class="url-text" rows="3">{{ currentUrl }}</textarea>
        <div class="url-actions">
          <Button variant="primary" @click="copyURL(); showUrl = false">Copy</Button>
          <Button @click="showUrl = false">Close</Button>
        </div>
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
    <input ref="fileInput" type="file" accept=".json" style="display:none" @change="onLoadFile" />
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

.url-row {
  display: flex;
  justify-content: center;
  padding: 0 3vh;
}

/* URL overlay */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.url-dialog {
  background: var(--bg-primary);
  border: 1px solid var(--border-primary);
  padding: 3vh;
  width: 90%;
  max-width: 420px;
}

.url-label {
  margin: 0 0 1.5vh 0;
  font-size: 15px;
  color: var(--text-primary);
}

.url-text {
  width: 100%;
  border: 1px solid var(--border-primary);
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-family: monospace;
  font-size: 12px;
  padding: 1vh;
  resize: none;
  box-sizing: border-box;
  word-break: break-all;
}

.url-actions {
  display: flex;
  gap: 2vh;
  margin-top: 2vh;
  justify-content: flex-end;
}
</style>
