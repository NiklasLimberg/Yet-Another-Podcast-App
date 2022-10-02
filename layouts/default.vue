<template>
    <div>
        <google-sign-in-button
            theme="filled_black"
            @success="loginSuccess"
            @error="loginError"
        />
        <slot />
        <audio-player />
    </div>
</template>

<script setup lang="ts">
import { CredentialResponse } from 'vue3-google-signin';

function loginSuccess(credentialResponse: CredentialResponse) {
    console.log( credentialResponse);
}

function loginError() {
    console.log('Login failed');
}
</script>