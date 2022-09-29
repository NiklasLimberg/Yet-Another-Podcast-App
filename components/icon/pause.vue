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
        <line
            x1="35"
            y1="30"
            x2="35"
            y2="70"
        /> 
        <line
            x1="65"
            y1="30"
            x2="65"
            y2="70"
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