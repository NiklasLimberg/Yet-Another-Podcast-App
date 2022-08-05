import { Episode } from '~types/Episode';

const audioElement = new Audio();

const playingMedia = ref<Episode | undefined>()

function setMedia(episode: Episode, { autoPlay }: { autoPlay: boolean } = { autoPlay: false }): void {
    audioElement.src = episode.enclosure;
    audioElement.load();

    audioElement.currentTime = episode.progress;
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

const isPaused = ref(true);
audioElement.onplay = () => isPaused.value = false;
audioElement.onpause = () => isPaused.value = true;

function pause() {
    console.log('pause')
    audioElement.pause()
}

function play() {
    console.log('play')
    audioElement.play()
}


export default function () {
    return {
        playingMedia: readonly(playingMedia),
        isBuffering: readonly(isBuffering),
        progress: readonly(progress),
        isPaused: readonly(isPaused),
        setMedia,
        skipTo,
        skip,
        pause,
        play,
    }
}