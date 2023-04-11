<template>
    <div
        v-infinite-scroll="onLoadMore"
        class="infinite-container"
    >
        <div class="content">
            <EpisodeCard 
                v-for="episode in episodes"
                :key="episode.id"
                :episode="episode"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { client } from '~~/utils/trpcClient';
import { vInfiniteScroll } from '@vueuse/components';

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
    if(fetchPending.value) {
        return;
    }

    episodes.value = episodes.value.concat(await fetchEpisodes());
}
</script>

<style scoped>
@media (min-width: 1024px) {
    .content {
        margin: 0 auto;
        width: 620px;
    }
}

.infinite-container {
  overflow-y: scroll;
  width: 100%;
}

.content {
   display: grid;
   gap: 16px;
}
</style>