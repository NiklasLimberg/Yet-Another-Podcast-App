import { defineStore } from 'pinia';

import { useAuthStore } from './auth-store';

interface ProgressState {
    progress: number
    timestamp: Date
}


interface PlaybackProgressEvent {
    episodeId: string
    localState: ProgressState;
    persistedState: ProgressState;
}

import { client } from '~~/utils/trpcClient';

export const usePlaybackProgressStore = defineStore('playback-progress-store', () => {
    const authStore = useAuthStore();
    
    const progressEvents = ref<PlaybackProgressEvent[]>([]);

    function getProgress(episodeId: string): ProgressState | undefined {
        return progressEvents.value.find(event => event.episodeId == episodeId)?.localState;
    }

    function setProgress(episodeId: string, progress: number) {
        const existingEvent = progressEvents.value.find(event => event.episodeId == episodeId);
        
        if (!existingEvent) {
            progressEvents.value.push({
                episodeId,
                localState: {
                    progress,
                    timestamp: new Date(),
                },
                persistedState: {
                    progress,
                    timestamp: new Date(),
                },
            });

            return;
        }

        existingEvent.localState = {
            progress,
            timestamp: new Date(),
        };

        if (Math.abs(existingEvent.localState.progress - existingEvent.persistedState.progress) > 20) {
            void persistProgress(episodeId, progress, existingEvent.localState.timestamp);

            existingEvent.persistedState = existingEvent.localState;
        }
    }

    async function persistProgress(episodeId: string, progress: number, timestamp: Date) {
        if (!authStore.user) {
            // todo: fallback to idb
            return;
        }

        try {
            client.progress.write.mutate({
                episodeId,
                progress,
                eventTimestamp: timestamp,
            });
        } catch (error) {
            // todo: fallback to idb
            console.error(error);
        }
    }

    return {
        progressEvents,
        getProgress,
        setProgress,
    };
});
