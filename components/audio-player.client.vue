<template>
    <div
        v-if="audioSessionStore.playingMedia"
        class="container"
    >
        <audio
            ref="audioElement"
            preload="metadata"
        />
        <div class="space-between">
            <div class="description-container">
                <h3>
                    {{ audioSessionStore.playingMedia.title }}
                </h3>
                <p class="series-title">
                    {{ audioSessionStore.playingMedia.seriesTitle }}
                </p>
            </div>
            <div class="flex">
                <button
                    type="button"
                    class="transparent"
                    @click="skip(-30)"
                >
                    <icon-skip-backward />
                </button>
                <button
                    v-if="audioSessionStore.isPaused"
                    type="button"
                    class="transparent"
                    @click="play()"
                >
                    <icon-play :size="32" />
                </button>
                <button
                    v-else
                    type="button"
                    class="transparent"
                    @click="pause()"
                >
                    <icon-pause :size="32" />
                </button>
                <button
                    type="button"
                    class="transparent"
                    @click="skip(30)"
                >
                    <icon-skip-forward />
                </button>
            </div>
        </div>
        <input
            class="seek-slider" 
            type="range"
            :max="audioSessionStore.playingMedia.duration"
            :value="playbackProgress"
            min="0"
            @change="seek"
        >
        <div class="space-between">
            <div>
                {{ formatTime(playbackProgress) }}
            </div>
            <div>
                - {{ formatTime(audioSessionStore.playingMedia.duration - playbackProgress) }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const audioSessionStore = useMediaSessionStore();
const playbackProgressStore = usePlaybackProgressStore();

const audioElement = new Audio();
const mediaSession = navigator.mediaSession;

function formatTime(seconds: number) {
    return [
        Math.floor(seconds / 60 / 60),
        Math.floor(seconds / 60 % 60),
        Math.floor(seconds % 60),
    ].join(':').replace(/\b(\d)\b/g, '0$1');
}

const playbackProgress = computed({ 
    get: () => {
        if(!audioSessionStore.playingMedia) {
            return 0;
        }

        return playbackProgressStore.getProgress(audioSessionStore.playingMedia.id)?.progress ?? 0;
    }, 
    set: (progress: number) => {
        if(!audioSessionStore.playingMedia) {
            return;
        }

        playbackProgressStore.setProgress(audioSessionStore.playingMedia.id, progress);
    },
});

watch(() => audioSessionStore.playingMedia, (media) => {
    if(!media) {
        return;
    }
    audioElement.src = media.enclosure;

    audioElement.currentTime = media.progress;

    mediaSession.metadata = new MediaMetadata({
        title: media.title,
        artist: media.seriesTitle,
        artwork: [
            { src: media.image },
        ],
    });

    mediaSession.setPositionState({
        duration: media.duration,
        playbackRate: 1,
        position: media.progress,
    });

    audioElement.play();
});

watch(() => audioSessionStore.isPaused, (isPaused) => {
    isPaused ? audioElement.pause() : audioElement.play();
});

audioElement.onwaiting = () => { audioSessionStore.isBuffering = true; };
audioElement.onplaying = () => { audioSessionStore.isBuffering = false; };


audioElement.onseeking = () => { 
    audioSessionStore.isSeeking = true;
};
audioElement.onseeked = () => { 
    audioSessionStore.isSeeking = false;
};

audioElement.ontimeupdate = () => {
    if(audioSessionStore.isSeeking || !audioSessionStore.playingMedia) {
        return;
    }

    console.log('setting progress', audioElement.currentTime);

    playbackProgressStore.setProgress(audioSessionStore.playingMedia.id, audioElement.currentTime);
};

function skipTo(seconds: number) {
    window.requestAnimationFrame(()=> {
        if(audioSessionStore.isPaused) {
            playbackProgress.value = seconds;
        }

        audioElement.currentTime = seconds;
    });    
}

function seek(ev: Event) {
    skipTo((ev.target as HTMLInputElement).valueAsNumber);
}

function skip(seconds: number) {
    skipTo(audioElement.currentTime + seconds);
}

audioElement.onplay = () => audioSessionStore.isPaused = false;
audioElement.onpause = () => audioSessionStore.isPaused = true;

function pause() {
    audioElement.pause();
}

function play() {
    audioElement.play();
}

mediaSession.setActionHandler('play', ({action}) => { 
    if(action === 'play') {
        play();
    }
});

mediaSession.setActionHandler('pause', ({action}) => { 
    if(action === 'pause') {
        pause();
    }
});

mediaSession.setActionHandler('previoustrack', ({action}) => { 
    if(action === 'previoustrack') {
        skip(-30);
    }
});

mediaSession.setActionHandler('nexttrack',({action}) => { 
    if(action === 'nexttrack') {
        skip(30);
    }
});

mediaSession.setActionHandler('seekto', ({action, seekTime}) => { 
    if(action === 'seekto' && seekTime) {
        skipTo(seekTime);
    }
});
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