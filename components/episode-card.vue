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
                @click="changePlayBackState"
            >
                <icon-play
                    v-if="isPaused"
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

const isSelected = computed(() => mediaSessionStore.playingMedia?.id === props.episode.id);

const isPaused = computed(() => {
    if (!isSelected.value) {
        return true;
    }

    return mediaSessionStore.isPaused;
});

const playbackProgress = computed(() => {
    if (isSelected.value) {
        return mediaSessionStore.progress;
    }

    const localState = playbackProgressStore.getProgress(props.episode.id);

    if (localState) {
        return localState.progress;
    }

    return props.episode.playbackProgress;
});


const timeLeft = computed(() => {
    return Math.floor((props.episode.duration - playbackProgress.value) / 60 % 60);
});

function changePlayBackState() {
    if(!isPaused.value) {
        mediaSessionStore.pause();
        return;
    }

    if (!isSelected.value) {
        mediaSessionStore.setPlayingMedia( {
            id: props.episode.id,
            title: props.episode.title,
            enclosure: props.episode.enclosure,
            seriesTitle: props.episode.series.title,
            image: props.episode.image,
            duration: props.episode.duration,
            progress: unref(playbackProgress.value),
        });
    }

    mediaSessionStore.play();
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