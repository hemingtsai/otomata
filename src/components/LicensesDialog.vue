<script setup lang="ts">
import Button from "./Button.vue";
import licenseTextRaw from "../../licenses.txt?raw";

defineEmits<{
  close: [];
}>();

const licenseText = licenseTextRaw;</script>

<template>
  <div class="overlay">
    <div class="dialog">
      <h3 class="dialog-title">Licenses</h3>
      <pre class="license-text">{{ licenseText }}</pre>
      <div class="actions">
        <Button variant="primary" @click="$emit('close')">Close</Button>
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
  max-width: 480px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.dialog-title {
  margin: 0 0 2vh 0;
  font-size: 18px;
  color: var(--text-primary);
  flex-shrink: 0;
}

.license-text {
  flex: 1;
  overflow-y: auto;
  font-size: 12px;
  line-height: 1.5;
  color: var(--text-secondary);
  white-space: pre-wrap;
  margin: 0;
  padding: 1vh;
  border: 1px solid var(--border-secondary);
  background: var(--bg-secondary);
}

.actions {
  margin-top: 2vh;
  display: flex;
  justify-content: flex-end;
  flex-shrink: 0;
}
</style>
