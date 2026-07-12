<script setup lang="ts">
import { ref, nextTick, onUnmounted } from "vue";

const props = defineProps<{
  modelValue: number;
  placeholder?: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: number];
}>();

const open = ref(false);
const triggerRef = ref<HTMLDivElement>();

function closeOnOutside(e: MouseEvent) {
  if (triggerRef.value && !triggerRef.value.contains(e.target as Node)) {
    open.value = false;
    document.removeEventListener("click", closeOnOutside);
  }
}

async function toggle() {
  if (open.value) {
    open.value = false;
    document.removeEventListener("click", closeOnOutside);
  } else {
    open.value = true;
    await nextTick();
    document.addEventListener("click", closeOnOutside);
  }
}

function onSelect(value: number) {
  emit("update:modelValue", value);
  open.value = false;
  document.removeEventListener("click", closeOnOutside);
}

onUnmounted(() => {
  document.removeEventListener("click", closeOnOutside);
});
</script>

<template>
  <div ref="triggerRef" class="dropdown">
    <button class="trigger" @click.stop="toggle">
      <span class="trigger-text">
        <slot name="label" />
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
      <slot :select="onSelect" :active="props.modelValue" />
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
