<template>
    <div class="main-content">
        <slot class="page-slot" />
        <audio-player />
    </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore();
</script>

<style scoped>
.main-content {
    display: flex;
    flex-direction: column;
    height: 100vh;
}

.page-slot {
    flex: 1 1 auto;
}
</style>