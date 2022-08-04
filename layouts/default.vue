<template>
  <div>
    <slot />
    <audio-player
      v-if="playingEpisode"
      :episode="playingEpisode"
    />
  </div>
</template>


<script lang="ts" setup>
const playingEpisode = usePlayingEpisode();
</script>