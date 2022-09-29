<template>
    <div
        v-infinite-scroll="onLoadMore"
        class="infinite-container"
    >
        <EpisodeCard 
            v-for="episode in episodes"
            :key="episode.id"
            :episode="episode"
        />
    </div>
</template>

<script setup lang="ts">
import { vInfiniteScroll } from '@vueuse/components'

const { data: episodes } = await useFetch('/api/feed');

let fetchPending = false;
async function fetchEpisodes(cursor?: string) {
    fetchPending = true;
    const data = $fetch('/api/feed', { params: { cursor }})
    fetchPending = false;
    return data;
} 

async function onLoadMore() {
    if(fetchPending) {
        return
    }

    const cursor = episodes.value.at(-1)?.id
    episodes.value = episodes.value.concat(await fetchEpisodes(cursor))
}
</script>

<style scoped>

@media (min-width: 1024px) {
    .infinite-container {
        width: 620px;
        margin: 0 auto;
    }
}

.infinite-container {
  display: grid;
  gap: 16px;

  height: 100vh;
  overflow-y: scroll;
}
</style>