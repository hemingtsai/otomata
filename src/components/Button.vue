<script setup lang="ts">
defineProps<{
  variant?: "primary" | "secondary";
  disabled?: boolean;
}>();

defineEmits<{
  click: [];
}>();
</script>

<template>
  <button class="btn" :class="variant || 'secondary'" :disabled="disabled" @click="$emit('click')">
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

.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
