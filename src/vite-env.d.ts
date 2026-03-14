/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_OPEN_LIBRARY_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
