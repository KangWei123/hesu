// shims-vue.d.ts
declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    VUE_APP_DOMAIN: string;
    VUE_APP_CDN_DOMAIN: string;
    VUE_APP_BACKEND_DOMAIN: string;
    VUE_APP_ASSETS_DIR: string;
    VUE_APP_VERSION: string;
    VUE_APP_PROTOCOL: string;
    VUE_APP_ASSETS_URL: string;
    VUE_APP_CDN_URL: string;
    VUE_APP_BACKEND_URL: string;
  }
}
