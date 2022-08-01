<template>
  <div class="container">
    <p>Fixed at the bottom!</p>
    <audio
      v-if="playingEpisode"
      ref="audioElement"
      :src="playingEpisode.enclosure"
      preload="metadata"
      controls
      @timeupdate="logProgress"
    />
  </div>
</template>

<script lang="ts" setup>
const playingEpisode = usePlayingEpisode();

const audioElement = ref<HTMLAudioElement | null>(null)

function logProgress() {
    console.log(audioElement.value?.currentTime)
}
</script>

<style scoped>
.container {
    position: fixed;
    width: 100vw;
    bottom: 0;
    left: 0;
}
</style>