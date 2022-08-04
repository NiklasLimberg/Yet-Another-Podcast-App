<template>
    <div
        class="card"
        @click="setPlaying"
    >
        <div class="title-container">
            <img :src="episode.image">
            <span>{{ episode.seriesTitle }}</span>
        </div>
        <h3>{{ episode.title }}</h3>
        <span v-html="episode.descriptionHTML" />
    </div>
</template>

<script setup lang="ts">
import type { Episode } from '~types/Episode';

const audioPlayer = audioSession();

const props = defineProps<{
  episode: Episode
}>()

function setPlaying() {
    audioPlayer.setMedia(props.episode, { autoPlay: true });
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

</style>