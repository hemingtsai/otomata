<script setup lang="ts">
import Button from "./Button.vue";

defineEmits<{
  close: [];
}>();

const licenseText = `MIT License

Copyright (c) 2020 Kunal Marwaha
Copyright (c) 2025 Hemingtsai

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

Third-party dependencies:

tone (MIT) — Web Audio framework
vue (MIT) — UI framework
@tauri-apps/api (MIT OR Apache-2.0) — Desktop app framework
@tauri-apps/plugin-dialog (MIT OR Apache-2.0) — Native file dialogs
@tauri-apps/plugin-fs (MIT OR Apache-2.0) — File system access
@tauri-apps/cli (MIT OR Apache-2.0) — Build tooling
@iconify/vue (MIT) — Icon framework
@vitejs/plugin-vue (MIT) — Build plugin
typescript (Apache-2.0) — Type system
vite (MIT) — Build tool
vue-tsc (MIT) — Type checking
tauri (MIT OR Apache-2.0) — Desktop framework (Rust)
tauri-plugin-opener (MIT OR Apache-2.0) — URL opening
serde (MIT OR Apache-2.0) — Serialization (Rust)
serde_json (MIT OR Apache-2.0) — JSON support (Rust)`;
</script>

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
