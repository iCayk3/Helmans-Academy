/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SAAS_URL?: string;
  readonly VITE_WHATSAPP_NUMBER?: string;
  readonly VITE_LEADS_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
