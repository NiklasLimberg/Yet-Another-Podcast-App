import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    typescript: {
        strict: true,
        shim: false,
    },
    buildModules: [
        '@nuxtjs/google-fonts'
    ],
    css: [
        '@/assets/css/global.css'
    ],
    googleFonts: {
        families: {
            Inter: true,
        }
    },
    ssr: false
})
