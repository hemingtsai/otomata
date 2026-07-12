<script setup lang="ts">
defineProps<{
  value: string | number;
  active?: string | number;
}>();

defineEmits<{
  select: [value: string | number];
}>();
</script>

<template>
  <button
    class="dropdown-item"
    :class="{ selected: active === value }"
    @click="$emit('select', value)"
  >
    <slot />
  </button>
</template>

<style scoped>
.dropdown-item {
  width: 100%;
  padding: 1.2vh 1.5vh;
  border: none;
  border-bottom: 1px solid var(--border-secondary);
  background: transparent;
  color: var(--text-primary);
  font-family: inherit;
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item.selected {
  color: var(--accent);
}
</style>
