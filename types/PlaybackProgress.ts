import zod from 'zod';

export const playbackProgressOutput = zod.object({
    id: zod.string(),
    episodeId: zod.string(),
    created: zod.date(),
    updated: zod.date().optional(),
});

export type PlaybackProgress = zod.infer<typeof playbackProgressOutput>;