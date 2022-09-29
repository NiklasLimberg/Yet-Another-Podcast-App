<template>
    <div
        v-if="audioSession.playingMedia.value"
        class="container"
    >
        <div class="space-between">
            <div class="description-container">
                <h3>
                    {{ audioSession.playingMedia.value.title }}
                </h3>
                <p class="series-title">
                    {{ audioSession.playingMedia.value.seriesTitle }}
                </p>
            </div>
            <div class="flex">
                <button
                    type="button"
                    class="transparent"
                    @click="audioSession.skip(-30)"
                >
                    <icon-skip-backward />
                </button>
                <button
                    v-if="audioSession.isPaused.value"
                    type="button"
                    class="transparent"
                    @click="audioSession.play()"
                >
                    <icon-play :size="32" />
                </button>
                <button
                    v-else
                    type="button"
                    class="transparent"
                    @click="audioSession.pause()"
                >
                    <icon-pause :size="32" />
                </button>
                <button
                    type="button"
                    class="transparent"
                    @click="audioSession.skip(30)"
                >
                    <icon-skip-forward />
                </button>
            </div>
        </div>
        <input
            type="range"
            :max="audioSession.playingMedia.value.duration"
            :value="audioSession.progress.value"
            min="0"
            @change="setProgress"
        >
        <div class="space-between">
            <div>
                {{ formatTime(audioSession.progress.value) }}
            </div>
            <div>
                - {{ formatTime(audioSession.playingMedia.value.duration - audioSession.progress.value) }}
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
const audioSession = useAudioSession()

function setProgress(ev: Event) {
    audioSession.skipTo((ev.target as HTMLInputElement).valueAsNumber);
}

function formatTime(seconds: number) {
    return [
        Math.floor(seconds / 60 / 60),
        Math.floor(seconds / 60 % 60),
        Math.floor(seconds % 60)
    ].join(':').replace(/\b(\d)\b/g, '0$1')
}
</script>

<style scoped>
.container {
    position: fixed;
    width: 100vw;
    bottom: 0;
    left: 0;
    
    background-color: var(--neutrals-dark-gray-800);
    padding: 16px;
    z-index: 1;
}
.space-between {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

h3 {
    margin: 0;
}

.flex {
    display: flex;
}

input {
    padding: 0;
}

@media (min-width: 1024px) {
    .description-container {
        display: flex;
        align-items: baseline;
    }
 
    .series-title::before {
        margin: 0px 8px;
        content: '-';
    }
}
</style>