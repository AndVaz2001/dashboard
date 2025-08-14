/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TINYBIRD_TOKEN: string
  readonly VITE_ROI_API_URL: string
  readonly VITE_REACH_API_URL: string
  readonly VITE_ENGAGEMENT_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
