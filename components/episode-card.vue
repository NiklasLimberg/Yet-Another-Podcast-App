<template>
    <div
        class="card"
        @click="setPlaying"
    >
        <div class="title-container">
            <img :src="episode.image">
            <div>
                <div class="series-title">{{ episode.seriesTitle }}</div>
                <div>{{ new Date(episode.pubDate).toLocaleString() }}</div>
            </div>
        </div>
        <h3>{{ episode.title }}</h3>
        <span v-html="episode.descriptionHTML" />
    </div>
</template>

<script setup lang="ts">
import type { Episode } from '~types/Episode';

const audioPlayer = useAudioSession();

const props = defineProps<{
  episode: Episode
}>()

function setPlaying() {
    audioPlayer.setMedia(props.episode);
}
</script>

<style scoped>
.title-container {
  display: flex;
  gap: 16px;
}
.series-title {
    margin-bottom: 8px;
}

img {
  height: 44px;
  width: 44px;
}
</style>