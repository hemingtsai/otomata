<script setup lang="ts">
import { ref } from "vue";
import Button from "./Button.vue";
import ScaleDropdown from "./ScaleDropdown.vue";

const props = defineProps<{
  timerSet: boolean;
  bpm: number;
  scaleId: number;
  selectedDir: number;
}>();

const emit = defineEmits<{
  toggleTimer: [];
  clear: [];
  changeBpm: [bpm: number];
  changeScale: [id: number];
  selectDir: [dir: number];
  load: [url: string];
}>();

const loadUrl = ref("");

function onBpmChange(e: Event) {
  const val = parseInt((e.target as HTMLInputElement).value, 10);
  if (!isNaN(val)) {
    emit("changeBpm", val);
  }
}

function onScaleSelect(value: number) {
  emit("changeScale", value);
}

function onLoad() {
  emit("load", loadUrl.value);
}
</script>

<template>
  <div class="controls">
    <div class="row buttons">
      <Button variant="primary" @click="$emit('toggleTimer')">
        {{ timerSet ? "Pause" : "Play" }}
      </Button>
      <Button @click="$emit('clear')">Clear</Button>
    </div>

    <div class="row">
      <label class="label">Tempo</label>
      <input
        class="bpm-input"
        type="number"
        min="50"
        max="300"
        :value="bpm"
        :disabled="timerSet"
        @change="onBpmChange"
      />
    </div>

    <div class="row">
      <label class="label">Scale</label>
      <ScaleDropdown :model-value="scaleId" @update:model-value="onScaleSelect" />
    </div>

    <div class="row dir-row">
      <button
        v-for="dir in [0, 1, 2, 3]"
        :key="dir"
        class="dir-btn"
        :class="{ active: selectedDir === dir }"
        @click="$emit('selectDir', dir)"
      >
        {{ ['↑', '→', '↓', '←'][dir] }}
      </button>
    </div>

    <div class="divider" />

    <div class="row">
      <input
        class="url-input"
        placeholder="Paste URL to load..."
        v-model="loadUrl"
      />
      <Button @click="onLoad">Load</Button>
    </div>
  </div>
</template>

<style scoped>
.controls {
  display: flex;
  flex-direction: column;
  gap: 1.5vh;
  padding: 2vh 3vh;
}

.row {
  display: flex;
  align-items: center;
  gap: 1.5vh;
}

.row.buttons {
  gap: 1.5vh;
}

.row.buttons > * {
  flex: 1;
}

.label {
  font-size: 14px;
  color: var(--text-secondary);
  width: 56px;
  flex-shrink: 0;
  text-align: right;
}

.bpm-input {
  width: 72px;
  padding: 1vh;
  border: 1px solid var(--border-primary);
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: inherit;
  font-size: 14px;
  text-align: center;
  flex-shrink: 0;
}

.bpm-input:disabled {
  opacity: 0.5;
}

.url-input {
  flex: 1;
  padding: 1vh;
  border: 1px solid var(--border-primary);
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: inherit;
  font-size: 14px;
  min-width: 0;
}

.url-input::placeholder {
  color: var(--text-tertiary);
}

.divider {
  width: 100%;
  border-top: 1px solid var(--border-secondary);
}

.dir-row {
  gap: 0;
}

.dir-btn {
  flex: 1;
  padding: 1vh 0;
  border: 1px solid var(--border-primary);
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: inherit;
  font-size: 18px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  margin-left: -1px;
}

.dir-btn:first-child {
  margin-left: 0;
}

.dir-btn.active {
  background: var(--accent);
  color: var(--accent-contrast);
}
</style>
