/// <reference types="vite/client" />

declare interface Window {
  __TAURI__?: Record<string, unknown>;
}

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<object, object, unknown>;
  export default component;
}
