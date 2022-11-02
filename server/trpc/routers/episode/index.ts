import { router, publicProcedure } from '~/server/trpc';
import prisma from '~/server/prisma-db';
import zod from 'zod';

import { episodeWithSeriesOutput } from '~~/types/Episode';

export const episodeRouter = router({
    feed: publicProcedure.input(
        zod.object({
            limit: zod.number().min(1).max(100).optional(),
            cursor: zod.string().optional(),
        }),
    ).output(
        zod.object({
            episodes: zod.array(
                episodeWithSeriesOutput,
            ),
            nextCursor: zod.string().optional(),
            total: zod.number(),
        }),
    ).query(async ({ input, ctx }) => {
        const limit = input.limit ?? 50;
        const { cursor } = input;
        const itemsRequest = prisma.episode.findMany({
            take: limit + 1, // get an extra item at the end which is used as next cursor
            cursor: cursor ? { id: cursor } : undefined,
            include: {
                series: {
                    select: {
                        id: true,
                        title: true,
                        image: true,
                    },
                },
                playbacks: {
                    select: {
                        progress: true,
                    },
                    where: {
                        userId: ctx.userId,
                    },
                },
                keywords: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                updated: 'asc',
            },
        });

        const totalRequest = prisma.episode.count();
        const [items, total] = await Promise.all([itemsRequest, totalRequest]);
        
        let nextCursor: string | undefined = undefined;
        if (items.length > limit) {
            nextCursor = items.at(-1)?.id;
        }

        const episodes = items.map((episode) => {
            const playback = episode.playbacks[0];
        
            return {
                ...episode,
                playbackProgress: playback?.progress ?? 0,
            };
        });

        return {
            episodes,
            total,
            nextCursor,
        };
    }),
});