<script setup lang="ts">
import ScaleDropdown from "./ScaleDropdown.vue";
import Button from "./Button.vue";

const props = defineProps<{
  bpm: number;
  scaleId: number;
  gridSize: number;
  scaleOffset: number;
  timerSet: boolean;
}>();

const emit = defineEmits<{
  close: [];
  changeBpm: [bpm: number];
  changeScale: [id: number];
  changeGridSize: [size: number];
  changeScaleOffset: [offset: number];
}>();

import { ALL_SCALES } from "../constants";
import { computed } from "vue";

const scaleOffsetMax = computed(() => Math.max(0, ALL_SCALES[props.scaleId].scale.length - props.gridSize));
</script>

<template>
  <div class="overlay" @click.self="$emit('close')">
    <div class="dialog">
      <h3 class="dialog-title">Settings</h3>

      <div class="field">
        <label class="label">Tempo</label>
        <input
          class="input"
          type="number"
          min="50"
          max="300"
          :value="bpm"
          :disabled="timerSet"
          @change="e => { const v = parseInt((e.target as HTMLInputElement).value, 10); if (!isNaN(v)) $emit('changeBpm', v); }"
        />
      </div>

      <div class="field">
        <label class="label">Size</label>
        <input
          class="input"
          type="number"
          min="3"
          max="9"
          :value="gridSize"
          :disabled="timerSet"
          @change="e => { const v = parseInt((e.target as HTMLInputElement).value, 10); if (!isNaN(v)) $emit('changeGridSize', v); }"
        />
      </div>

      <div class="field">
        <label class="label">Scale</label>
        <ScaleDropdown :model-value="scaleId" @update:model-value="v => $emit('changeScale', v)" />
      </div>

      <div class="field">
        <label class="label">Start</label>
        <input
          class="input"
          type="number"
          min="0"
          :max="scaleOffsetMax"
          :value="scaleOffset"
          @change="e => { const v = parseInt((e.target as HTMLInputElement).value, 10); if (!isNaN(v)) $emit('changeScaleOffset', v); }"
        />
      </div>

      <div class="actions">
        <Button variant="primary" @click="$emit('close')">Done</Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.dialog {
  background: var(--bg-primary);
  border: 1px solid var(--border-primary);
  padding: 3vh;
  width: 90%;
  max-width: 340px;
}

.dialog-title {
  margin: 0 0 2vh 0;
  font-size: 18px;
  color: var(--text-primary);
}

.field {
  display: flex;
  align-items: center;
  gap: 1.5vh;
  margin-bottom: 1.5vh;
}

.label {
  font-size: 14px;
  color: var(--text-secondary);
  width: 56px;
  flex-shrink: 0;
  text-align: right;
}

.input {
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

.input:disabled {
  opacity: 0.5;
}

.actions {
  margin-top: 2vh;
  display: flex;
  justify-content: flex-end;
}
</style>
