import { defineStore } from 'pinia';
import { EpisodeWithSeries } from '~~/types/Episode';

import { client } from '~~/utils/trpcClient';

export const useOfflineEpisodeStore = defineStore('offline-episode-store', () => {
    const offlineEpisodes = ref<EpisodeWithSeries[]>([]);

    return {
        offlineEpisodes,
    };
});