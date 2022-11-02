<template>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        fill="none"
        :width="size + 'px'"
        :height="size + 'px'"
        :stroke="strokeColor"
        :stroke-width="strokeWidth"
    > <polyline
        fill="none"
        points="10,75 10,90 90,90 90,75"
    /> <line
        x1="50"
        y1="15"
        x2="50"
        y2="65"
    /> <polyline
        fill="none"
        points="30,50 50,65 70,50"
    /></svg>
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
});
</script>