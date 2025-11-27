/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: "https://localhost:7122/api";
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
