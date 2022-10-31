import { defineStore } from 'pinia'

import type { MediaSessionInput } from '~~/types/MediaSessionInput'

export const useMediaSessionStore = defineStore('media-session-store', () => {
    const playingMedia = ref<MediaSessionInput | null>(null)
    const progress = ref(0)
    const isPaused = ref(true);
    const isBuffering = ref<boolean>(false);
    
    return { playingMedia, progress, isPaused, isBuffering }
})
