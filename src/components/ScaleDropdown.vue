<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const model = defineModel<string | number | undefined>();

defineProps<{
  placeholder?: string;
}>();

const open = ref(false);
const triggerRef = ref<HTMLDivElement>();

function toggle() {
  open.value = !open.value;
}

function onSelect(value: string | number | undefined) {
  model.value = value;
  open.value = false;
}

function onClickOutside(e: MouseEvent) {
  if (triggerRef.value && !triggerRef.value.contains(e.target as Node)) {
    open.value = false;
  }
}

onMounted(() => document.addEventListener("click", onClickOutside));
onUnmounted(() => document.removeEventListener("click", onClickOutside));
</script>

<template>
  <div ref="triggerRef" class="dropdown">
    <button class="trigger" @click="toggle">
      <span v-if="model !== undefined" class="trigger-text">
        <slot name="label" />
      </span>
      <span v-else class="trigger-placeholder">
        {{ placeholder || "Select" }}
      </span>
      <svg
        class="arrow"
        :class="{ open }"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>
    <div v-if="open" class="menu" @click.stop>
      <slot :select="onSelect" :active="model" />
    </div>
  </div>
</template>

<style scoped>
.dropdown {
  position: relative;
  width: 100%;
}

.trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2vw;
  padding: 1vh 1.5vh;
  border: 1px solid var(--border-primary);
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: inherit;
  font-size: 14px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  text-align: left;
}

.trigger-placeholder {
  color: var(--text-tertiary);
}

.arrow {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  color: var(--text-tertiary);
}

.arrow.open {
  transform: rotate(180deg);
}

.menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 20;
  max-height: 40vh;
  overflow-y: auto;
  border: 1px solid var(--border-primary);
  border-top: none;
  background: var(--bg-primary);
}
</style>
