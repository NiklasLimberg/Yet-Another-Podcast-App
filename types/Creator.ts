import zod from 'zod';

export const creatorOutput = zod.object({
    id: zod.string(),
    name: zod.string(),
    isPublicBroadcaster: zod.boolean(),
});

export type Creator = zod.infer<typeof creatorOutput>;