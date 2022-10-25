interface MediaInput {
    title: string;
    seriesTitle: string;
    image: string;
    enclosure: string;
    duration: number;
    progress: number;
}

const audioElement = new Audio();
const mediaSession = navigator.mediaSession;

const playingMedia = ref<MediaInput | undefined>()


function setMedia(episode: MediaInput, options: { autoPlay: boolean } = { autoPlay: false }): void {
    const { autoPlay } = options;

    audioElement.src = episode.enclosure;
    audioElement.load();

    audioElement.currentTime = episode.progress;
    playingMedia.value = episode;

    mediaSession.metadata = new MediaMetadata({
        title: episode.title,
        artist: episode.seriesTitle,
        artwork: [
            { src: episode.image }
        ]
    });

    mediaSession.setPositionState({
        duration: episode.duration,
        playbackRate: 1,
        position: episode.progress,
    });
    

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
    audioElement.pause()
}

function play() {
    audioElement.play()
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