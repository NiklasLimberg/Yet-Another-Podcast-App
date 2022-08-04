<template>
  <div class="container">
    <p>Fixed at the bottom!</p>
    <progress
      :max="episode.duration"
      :value="progress"
    />
    <audio
      ref="audioElement"
      @timeupdate="onTimeUpDate"
    />
    <div>
      <button @click="pausePlay">
        {{ isPaused ? 'Play!!!' : 'Pause!!!' }}
      </button>
      <button @click="skip(30)">
        Forward!!!
      </button>
      <button @click="skip(-30)">
        Backward!!!
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Episode } from '~types/Episode';

const props = defineProps<{
  episode: Episode
}>()

const audioElement = ref<HTMLAudioElement>()

const isPaused = ref(false);
const progress = ref(props.episode.progress);


onMounted(() => {
    if(!audioElement.value) {
        return; 
    }

    audioElement.value.src = props.episode.enclosure;
    audioElement.value.currentTime = props.episode.progress;
    audioElement.value.play()
})

watch(props.episode, () => {
    if(!audioElement.value) {
        return; 
    }
    
    audioElement.value.src = props.episode.enclosure;
    audioElement.value.currentTime = props.episode.progress;

    audioElement.value.load()
    audioElement.value.play()
})

function pausePlay() {
    if(!audioElement.value) {
        return
    }

    const paused = audioElement.value.paused
    
    if(paused) {
        audioElement.value.play()
    } else {
        audioElement.value.pause()
    }

    console.log(audioElement.value.paused)

    isPaused.value = audioElement.value.paused;
}

function onTimeUpDate() {
    if(!audioElement.value) {
        return
    }
    progress.value = Math.round(audioElement.value.currentTime)
}

function skip(seconds: number) {
    if(!audioElement.value) {
        return
    }

    const nextCurrentTime = audioElement.value.currentTime + seconds;
    audioElement.value.currentTime = nextCurrentTime;
    progress.value = nextCurrentTime;
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