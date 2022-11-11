import { defineStore } from 'pinia';

import { useAuthStore } from './auth-store';


interface PlaybackProgressEvent {
    episodeId: string
    progress: number;
    persistedProgress?: number; 
    date: Date;
}

import { client } from '~~/utils/trpcClient';

export const usePlaybackProgressStore = defineStore('playback-progress-store', () => {
    const authStore = useAuthStore();
    
    const progressEvents = ref<PlaybackProgressEvent[]>([]);

    function getProgress(episodeId: string): number | undefined {
        return progressEvents.value.find(event => event.episodeId == episodeId)?.progress;
    }

    async function setProgress(episodeId: string, progress: number) {
        const progressEvent = updateProgressEvent(episodeId, progress);
        
        if (!progressEvent.persistedProgress || Math.abs(progress - progressEvent.persistedProgress) > 20) {            
            await persistProgress(progressEvent);

            progressEvent.persistedProgress = progress;
        }
    }

    function updateProgressEvent(episodeId: string, progress: number): PlaybackProgressEvent {
        const progressEvent = progressEvents.value.find(event => event.episodeId == episodeId);
        
        if (progressEvent) {
            progressEvent.progress = progress;
            return progressEvent;
        }

        const newProgressEvent = {
            episodeId,
            progress: progress,
            date: new Date(),
        };

        progressEvents.value.push(newProgressEvent);

        return newProgressEvent;
    }

    async function persistProgress(progressEvent: PlaybackProgressEvent) {
        if (!authStore.user) {
            return;
        }

        try {
            client.progress.write.mutate({
                episodeId: progressEvent.episodeId,
                progress: progressEvent.progress,
                eventTimestamp: progressEvent.date,
            });
        } catch (error) {
            console.error(error);
        }
    }

    return {
        progressEvents,
        getProgress,
        setProgress,
    };
});
