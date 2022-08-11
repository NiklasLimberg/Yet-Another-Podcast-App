<template>
    <div
        v-if="audioSession.playingMedia.value"
        class="container"
    >
        <div class="description-container">
            <h3>
                {{ audioSession.playingMedia.value.title }}
            </h3>
            <p class="series-title">
                {{ audioSession.playingMedia.value.seriesTitle }}
            </p>
        </div>
        <input
            type="range"
            :max="audioSession.playingMedia.value.duration"
            :value="audioSession.progress.value"
            min="0"
            @change="setProgress"
        >
        <div class="flex">
            <button
                v-if="audioSession.isPaused.value"
                type="button"
                class="transparent"
                @click="audioSession.play()"
            >
                <icon-play />
            </button>
            <button
                v-else
                type="button"
                @click="audioSession.pause()"
            >
                Pause!!!
            </button>
            <button
                type="button"
                @click="audioSession.skip(30)"
            >
                Forward!!!
            </button>
            <button
                type="button"
                @click="audioSession.skip(-30)"
            >
                Backward!!!
            </button>
        </div>
    </div>
</template>

<script lang="ts" setup>
const audioSession = useAudioSession()

function setProgress(ev: Event) {
    audioSession.skipTo((ev.target as HTMLInputElement).valueAsNumber);
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

h3 {
    margin: 0;
}

.flex {
    display: flex;
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

@media (max-width: 1024px) {
    .series-title {
        margin-top: 16px;
    }
}
</style>