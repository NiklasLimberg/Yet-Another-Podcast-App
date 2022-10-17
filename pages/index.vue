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

const client = useTRPC()

let fetchPending = false;
let  nextCursor: string | null = null;
async function fetchEpisodes() {
    fetchPending = true;
    const response = await client.episodes.feed.query({ cursor: nextCursor });

    nextCursor = response.nextCursor;

    fetchPending = false;
    return response.items;
}

const episodes = ref(await fetchEpisodes());

async function onLoadMore() {
    if(fetchPending) {
        return
    }

    episodes.value = episodes.value.concat(await fetchEpisodes())
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