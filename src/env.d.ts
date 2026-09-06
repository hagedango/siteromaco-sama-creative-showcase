/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL?: string;
  readonly PUBLIC_X_URL?: string;
  readonly PUBLIC_X_SHARE_URL?: string;
  readonly PUBLIC_ROMACO_LITLINK_URL?: string;
  readonly PUBLIC_ROMACO_GAME_URL?: string;
  readonly PUBLIC_ROMACO_SUBSTACK_URL?: string;
  readonly PUBLIC_HAGEDANGO_X_URL?: string;
  readonly PUBLIC_ANALYTICS_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
