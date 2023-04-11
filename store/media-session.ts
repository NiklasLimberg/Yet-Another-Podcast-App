import { defineStore } from 'pinia';

import type { MediaSessionInput } from '~~/types/MediaSessionInput';
import { usePlaybackProgressStore } from './playback-progress-store';

export const useMediaSessionStore = defineStore('media-session-store', () => {
    const playbackProgressStore = usePlaybackProgressStore();

    const audioElement = typeof Audio !== 'undefined' ? new Audio() : {
        play() {
            throw new Error('Audio not supported in SSR');
        },
        pause() {
            throw new Error('Audio not supported in SSR');
        },
        onplay: null,
        onpause: null,
        ontimeupdate: null,
        onseeking: null,
        onseeked: null,
        onwaiting: null,
        onplaying: null,
        src: '',
        currentTime: 0,
        duration: 0,
    };
    const mediaSession = typeof navigator !== 'undefined' ? navigator.mediaSession : undefined;

    const playingMedia = ref<MediaSessionInput | null>(null);
    const isPaused = ref(true);
    const isSeeking = ref(false);
    const isBuffering = ref(false);
    const progress = ref(0);

    function setPlayingMedia(media: MediaSessionInput) {
        audioElement.src = media.enclosure;
    
        audioElement.currentTime = media.progress;

        if(mediaSession) {
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
        }

        playingMedia.value = media;
    }
    
    audioElement.onwaiting = () => { isBuffering.value = true; };
    audioElement.onplaying = () => { isBuffering.value = false; };

    audioElement.onseeking = () => { 
        isSeeking.value = true;
    };
    audioElement.onseeked = () => { 
        isSeeking.value = false;
    };

    audioElement.ontimeupdate = () => {
        if(!playingMedia.value) {
            return;
        }

        playbackProgressStore.setProgress(playingMedia.value.id, Math.floor(audioElement.currentTime));
        progress.value = Math.floor(audioElement.currentTime);
    };

    function skipTo(seconds: number) {
        audioElement.currentTime = seconds;
    }

    function skip(seconds: number) {
        skipTo(audioElement.currentTime + seconds);
    }

    audioElement.onplay = () => isPaused.value = false;
    audioElement.onpause = () => isPaused.value = true;

    function play() {
        audioElement.play();
    }

    function pause() {
        audioElement.pause();
    }

    if(mediaSession) {
        mediaSession.setActionHandler('play', ({action}) => { 
            if(action !== 'play') {
                return;
            }

            play();
        });

        mediaSession.setActionHandler('pause', ({action}) => { 
            if(action !== 'pause') {
                return;
            }

            pause();
        });

        mediaSession.setActionHandler('previoustrack', ({action}) => { 
            if(action !== 'previoustrack') {
                return;
            }

            skip(-30);
        });

        mediaSession.setActionHandler('nexttrack',({action}) => { 
            if(action !== 'nexttrack') {
                return;
            }

            skip(30);
        });

        mediaSession.setActionHandler('seekto', ({action, seekTime}) => { 
            if(action !== 'seekto' || !seekTime) {
                return;
            }

            skipTo(seekTime);
        });
    }
    
    return { 
        playingMedia,
        progress,
        isPaused,
        isSeeking,
        isBuffering,
        setPlayingMedia,
        play,
        pause,
        skip,
        skipTo,
    };
});
