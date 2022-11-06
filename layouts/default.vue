<template>
    <div>
        <slot />
        <audio-player />
    </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore();

console.log(authStore.user);
</script>