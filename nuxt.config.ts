// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // rest of your nuxt config
  devServer: {
    port: 7000
  },
  modules: [
    '@element-plus/nuxt'
  ],
  elementPlus: {
    /** Options */
  },
  runtimeConfig: {
    public: {
      openaiApiKey: process.env.NUXT_OPENAI_API_KEY,
      apiBackend: process.env.NUXT_API_BACKEND,
      tokenBackend: process.env.NUXT_TOKEN_BACKEND,
      appUrl: process.env.NUXT_APP_URL,
    }
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