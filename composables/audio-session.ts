import { Episode } from '~types/Episode';

const audioElement = new Audio();

const playingMedia = ref<Episode | undefined>()

function setMedia(episode: Episode, { autoPlay }: { autoPlay: boolean } = { autoPlay: false }): void {
    audioElement.src = episode.enclosure;
    audioElement.load();

    playingMedia.value = episode;

    if(autoPlay) {
        audioElement.play()
        isPaused.value = false;
    }
}

const isBuffering = ref<boolean | undefined>(undefined);
audioElement.onwaiting = () => { isBuffering.value = true }
audioElement.onplaying = () => { isBuffering.value = false }

const progress = ref(0);
audioElement.ontimeupdate = () => { 
    progress.value = Math.round(audioElement.currentTime)
}

function skipTo(seconds: number) {
    audioElement.currentTime = seconds;
}

function skip(seconds: number) {
    audioElement.currentTime += seconds;
}

/**
* Indicator for the ui
*
* @remarks
* Use in conjunction with isBuffering to get the playback state
*/
const isPaused = ref(true);
watch(isPaused, (shouldPause) => {
    if(shouldPause) {
        audioElement.pause()
    } else {
        audioElement.play()
    }
})

export default function () {
    return {
        playingMedia: readonly(playingMedia),
        isBuffering: readonly(isBuffering),
        progress: readonly(progress),
        setMedia,
        skipTo,
        skip,
        isPaused,
    }
}