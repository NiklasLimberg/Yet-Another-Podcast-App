import { defineNuxtConfig } from 'nuxt/config';

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    runtimeConfig: {
        domain: '',
    },
    imports: {
        dirs: ['store'],
    },
    typescript: {
        strict: true,
        shim: false,
    },
    modules: [
        '@pinia/nuxt',
    ],
    buildModules: [
        '@nuxtjs/google-fonts',
    ],
    css: [
        '@/assets/css/global.css',
    ],
    googleFonts: {
        families: {
            Inter: true,
        },
    },
});
