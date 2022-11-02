<template>
    <div>
        <div v-if="pending">
            Loading...
        </div>
        <div v-else-if="data">
            {{ data }}
        </div>
        <div v-if="error">
            {{ error }}
        </div>
    </div>
</template>

<script lang="ts" setup>
import { client } from '~~/utils/trpcClient';

const {
    data,
    pending,
    error,
} = await useAsyncData(() => client.user.sessions.query());
</script>