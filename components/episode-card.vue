<template>
  <div class="container">
    <div>{{ props.episode.title }}</div>
    <div v-html="props.episode.descriptionHTML" />
  </div>
</template>

<script setup lang="ts">
interface Episode {
  id: string
  guid: string
  title: string
  seriesId: string
  description: string
  descriptionHTML: string
  pubDate: Date
  enclosure: string
  image: string
  link: string
  duration: number
  created: Date
  updated: Date
}


const props = defineProps<{
  episode: Episode

}>()
</script>

<style scoped>
.container {
  margin-bottom: 2rem;
}
</style>