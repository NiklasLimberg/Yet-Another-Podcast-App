import zod from 'zod';

export const playbackProgressOutput = zod.object({
    episodeId: zod.string(),
    created: zod.date(),
    updated: zod.date().optional(),
});

export type PlaybackProgress = zod.infer<typeof playbackProgressOutput>;

export const playbackProgressInput = zod.object({
    episodeId: zod.string(),
    progress: zod.number(),
    eventTimestamp: zod.date(),
});

export type PlaybackProgressInput = zod.infer<typeof playbackProgressInput>;