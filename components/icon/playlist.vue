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
    ><polygon points="15,10 15,90 85,90 85,25 70,10" />
        <line
            x1="35"
            y1="55"
            x2="65"
            y2="55"
        />
        <line
            v-if="action === 'add'"
            x1="50"
            y1="40"
            x2="50"
            y2="70"
        />
        <polyline
            fill="none"
            points="70,10 70,25 85,25"
        /></svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
        size?: number,
        strokeWidth?: number,
        strokeColor?: string,
        action?: 'add' | 'remove',
    }>(), {
    size: 24,
    strokeWidth: 8,
    strokeColor: '#F9FAFB',
    action: 'add'
})
</script>