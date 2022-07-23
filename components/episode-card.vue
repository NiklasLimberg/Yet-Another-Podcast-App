<template>
  <div>
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

defineProps<{
  episode: Episode
}>()
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