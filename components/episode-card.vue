<template>
    <div>
        <div class="title-container">
            <img :src="episode.image">
            <div>
                <div class="series-title">
                    {{ episode.series.title }}
                </div>
                <div>{{ episode.pubDate.toLocaleString('de-DE') }}</div>
            </div>
        </div>
        <h3>{{ episode.title }}</h3>
        <div class="action-container">
            <button
                type="button"
                class="play-button"
                @click="isPlaying ? pausePlayBack() : startPlayBack()"
            >
                <icon-play
                    v-if="!isPlaying || mediaSessionStore.isPaused"
                />
                <icon-pause
                    v-else
                />
                <span>{{ timeLeft }} min left</span>
            </button>
            <button
                type="button"
                class="remove-border"
            >
                <icon-download />
            </button>
            <button
                type="button"
                class="remove-border"
            >
                <icon-playlist />
            </button>
        </div>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <span v-html="episode.descriptionHTML" />
    </div>
</template>

<script setup lang="ts">
import type { EpisodeWithSeries } from '~/types/Episode';

const mediaSessionStore = useMediaSessionStore();
const playbackProgressStore = usePlaybackProgressStore();

const props = defineProps<{
  episode: EpisodeWithSeries
}>();


const isPlaying = computed(() => mediaSessionStore.isCurrentlyPlaying(props.episode.id) && !mediaSessionStore.isPaused);
const timeLeft = computed(() => {
    const progress = playbackProgressStore.getProgress(props.episode.id)?.progress ?? props.episode.playbackProgress;

    return Math.floor((props.episode.duration - progress ?? 0) / 60 % 60);
});

function startPlayBack() {
    if(!mediaSessionStore.isCurrentlyPlaying(props.episode.id)) {
        mediaSessionStore.playingMedia = {
            id: props.episode.id,
            title: props.episode.title,
            enclosure: props.episode.enclosure,
            seriesTitle: props.episode.series.title,
            image: props.episode.image,
            duration: props.episode.duration,
            progress: playbackProgressStore.getProgress(props.episode.id)?.progress ?? props.episode.playbackProgress,
        };
    } else {
        mediaSessionStore.isPaused = false;
    }
}

function pausePlayBack() {
    mediaSessionStore.isPaused = true;
}
</script>

<style scoped>
.title-container {
  display: flex;
  gap: 16px;
}

img {
  height: 44px;
  width: 44px;
}

.action-container {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 8px 0;
}

.play-button {
    display: flex;
    align-items: center;
    gap: 8px;
}

.remove-border {
    border: none;
    padding: 0;
}
</style>