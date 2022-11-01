import { defineStore } from 'pinia'

import type { MediaSessionInput } from '~~/types/MediaSessionInput'

export const useMediaSessionStore = defineStore('media-session-store', () => {
    const playingMedia = ref<MediaSessionInput | null>(null)
    const progress = ref(0)
    const isPaused = ref(true);
    const isSeeking = ref(false);
    const isBuffering = ref(false);

    const isCurrentlyPlaying = (mediaId: string) => {
        return playingMedia.value?.id === mediaId
    }
    
    return { 
        playingMedia,
        progress,
        isPaused,
        isSeeking,
        isBuffering,
        isCurrentlyPlaying 
    }
})
