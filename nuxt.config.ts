// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-03-06',
  devtools: { enabled: true },
  typescript: {
    strict: true,
    shim: false,
  },
})
