<template>
    <div
        class="card"
        @click="setPlaying"
    >
        <div class="title-container">
            <img :src="episode.image">
            <div>
                <div class="series-title">
                    {{ episode.series.title }}
                </div>
                <div>{{ new Date(episode.pubDate).toLocaleString() }}</div>
            </div>
        </div>
        <h3>{{ episode.title }}</h3>
        <span v-html="episode.descriptionHTML" />
    </div>
</template>

<script setup lang="ts">
import type { EpisodeWithSeries } from '~/types/Episode';

const audioPlayer = useAudioSession();

const props = defineProps<{
  episode: EpisodeWithSeries
}>()

function setPlaying() {
    audioPlayer.setMedia({
        title: props.episode.title,
        enclosure: props.episode.enclosure,
        seriesTitle: props.episode.series.title,
        image: props.episode.image,
        duration: props.episode.duration,
        progress: props.episode.playbackProgress,
    });
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