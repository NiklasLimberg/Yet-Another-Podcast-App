<template>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        fill="none"
        :width="size + 'px'"
        :height="size + 'px'"
        :stroke="strokeColor"
        :stroke-width="strokeWidth"
        stroke-linecap="round"
        stroke-linejoin="round"
    >
        <polyline
            fill="none"
            points="10,10 50,50 10,90 "
        />
        <polyline
            fill="none"
            points="40,10 80,50 40,90 "
        />
    </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
        size?: number,
        strokeWidth?: number,
        strokeColor?: string,
    }>(), {
    size: 24,
    strokeWidth: 8,
    strokeColor: '#F9FAFB',
})
</script>
    