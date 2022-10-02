import { defineNuxtConfig } from 'nuxt/config'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    runtimeConfig: {
        googleSignInClientId: '',
        googleSignInProjectId: '',
        googleSignInAuthUri: '',
        googleSignInTokenUri: '',
        googleSignInAuthProviderX509CertUrl: '',
        googleSignInClientSecret: '',
        googleSignInJavascriptOrigins: '',
    },
    typescript: {
        strict: true,
        shim: false,
    },
    modules: [
        'nuxt-vue3-google-signin'
    ],
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
    googleSignIn: {
        clientId: '559908955144-t694ekgsqub0oqdbrh6bvmoajtllho81.apps.googleusercontent.com',
    },
    ssr: false
})
