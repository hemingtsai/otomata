<script setup lang="ts">
import { ref } from "vue";
import Button from "./Button.vue";
import ScaleDropdown from "./ScaleDropdown.vue";
import DropdownItem from "./DropdownItem.vue";
import { ALL_SCALES } from "../constants";

const props = defineProps<{
  timerSet: boolean;
  bpm: number;
  scaleId: number;
}>();

const emit = defineEmits<{
  toggleTimer: [];
  clear: [];
  changeBpm: [bpm: number];
  changeScale: [id: number];
  load: [url: string];
}>();

const loadUrl = ref("");

function onBpmChange(e: Event) {
  const val = parseInt((e.target as HTMLInputElement).value, 10);
  if (!isNaN(val)) {
    emit("changeBpm", val);
  }
}

function onLoad() {
  emit("load", loadUrl.value);
}

function onScaleSelect(value: string | number | undefined) {
  if (value !== undefined) {
    emit("changeScale", Number(value));
  }
}

// Map scaleId to name for label display
const currentScaleName = ALL_SCALES[props.scaleId]?.name || ALL_SCALES[0].name;
</script>

<template>
  <div class="controls">
    <div class="row">
      <Button variant="primary" @click="$emit('toggleTimer')">
        {{ timerSet ? "Pause" : "Play" }}
      </Button>
      <span class="spacer" />
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
      <ScaleDropdown :model-value="scaleId" placeholder="Select scale" @update:model-value="onScaleSelect">
        <template #label>{{ currentScaleName }}</template>
        <template #default="{ select, active }">
          <DropdownItem
            v-for="(s, idx) in ALL_SCALES"
            :key="idx"
            :value="idx"
            :active="active"
            @select="select"
          >
            {{ s.name }}
          </DropdownItem>
        </template>
      </ScaleDropdown>
    </div>

    <div class="divider" />

    <div class="row">
      <input
        class="url-input"
        placeholder="Paste URL to load..."
        v-model="loadUrl"
      />
    </div>
    <div class="row">
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

.spacer {
  flex: 1;
}

.label {
  font-size: 14px;
  color: var(--text-secondary);
  min-width: 50px;
}

.bpm-input {
  width: 60px;
  padding: 1vh;
  border: 1px solid var(--border-primary);
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: inherit;
  font-size: 14px;
  text-align: center;
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
}

.url-input::placeholder {
  color: var(--text-tertiary);
}

.divider {
  width: 100%;
  border-top: 1px solid var(--border-secondary);
}
</style>
