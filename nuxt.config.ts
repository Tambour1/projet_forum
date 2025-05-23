// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  build: {
    transpile: ["vuetify"],
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
    "@nuxtjs/tailwindcss",
    "nuxt-server-utils",
    "@sidebase/nuxt-session",
    "@pinia/nuxt",
  ],
  nitro: {
    experimental: {
      websocket: true,
    },
  },
  session: {
    storage: {
      type: 'cookie'
    },
    cookie: {
      name: 'sessionId', 
      httpOnly: true,
      maxAge: 60 * 60 * 24, 
      secure: false
    }
  },
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
});
