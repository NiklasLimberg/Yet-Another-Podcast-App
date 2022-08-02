<template>
  <div class="container">
    <p>Fixed at the bottom!</p>
    <div v-if="playingEpisode">
      <progress
        :max="playingEpisode.duration"
        :value="progress"
      />
      <audio
        ref="audioElement"
        :src="playingEpisode.enclosure"
        @timeupdate="onTimeUpDate"
      />
      <div>
        <button @click="audioElement?.play()">
          Play!!!!
        </button>
        <button @click="audioElement?.pause()">
          Pause!!!
        </button>
        <button @click="forward">
          Forward!!!
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const playingEpisode = usePlayingEpisode();

const audioElement = ref<HTMLAudioElement | null>()

const progress = ref(0);

function onTimeUpDate() {
    if(!audioElement.value) {
        return
    }
    progress.value = Math.round(audioElement.value.currentTime)
}

function forward() {
    if(!audioElement.value) {
        return
    }

    audioElement.value.currentTime += 30;
}
</script>

<style scoped>
.container {
    position: fixed;
    width: 100vw;
    bottom: 0;
    left: 0;
    padding: 16px;
}
</style>