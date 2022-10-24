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
import { client } from '~~/utils/trpcClient'
import { vInfiniteScroll } from '@vueuse/components'

const fetchPending = ref(false);
const nextCursor = ref<string|undefined>(undefined);

async function fetchEpisodes() {
    fetchPending.value = true;
    const response = await client.episodes.feed.query({ cursor: nextCursor.value });

    nextCursor.value = response.nextCursor;

    fetchPending.value = false;
    return response.episodes;
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