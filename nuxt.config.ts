// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // rest of your nuxt config
  devServer: {
    port: 7000
  },
  runtimeConfig: {
    openaiApiKey: process.env.OPENAI_API_KEY,
    apiBackend: process.env.API_BACKEND,
    tokenBackend: process.env.TOKEN_BACKEND,
  },
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  compatibilityDate: '2024-11-27',
});