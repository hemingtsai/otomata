<script setup lang="ts">
defineProps<{
  variant?: "primary" | "secondary";
}>();

defineEmits<{
  click: [];
}>();
</script>

<template>
  <button class="btn" :class="variant || 'secondary'" @click="$emit('click')">
    <slot />
  </button>
</template>

<style scoped>
.btn {
  padding: 1vh 2vh;
  border: 1px solid var(--border-primary);
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: inherit;
  font-size: 14px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  white-space: nowrap;
}

.primary {
  background: var(--accent);
  color: var(--accent-contrast);
  border-color: var(--accent);
}
</style>
