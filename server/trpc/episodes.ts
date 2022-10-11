import type { inferAsyncReturnType } from '@trpc/server'
import type { createContext } from '~/server/trpc'

import prisma from '~/server/prisma-db';
import trpc from '@trpc/server';
import zod from 'zod';

export const episodeRouter = trpc.router<inferAsyncReturnType<typeof createContext>>()
    .query('feed', {
        input: zod.object({
            limit: zod.number().min(1).max(100).nullish(),
            cursor: zod.string().nullish(),
        }),

        async resolve({ input }) {
            const limit = input.limit ?? 50;
            const { cursor } = input;
            const itemsRequest = prisma.episode.findMany({
                take: limit + 1, // get an extra item at the end which we'll use as next cursor
                cursor: cursor ? { id: cursor } : undefined,
                include: {
                    series: {
                        select: {
                            id: true,
                            title: true
                        }
                    }
                },
                orderBy: {
                    updated: 'asc',
                },
            })

            const totalRequest = prisma.episode.count();
            const [items, total] = await Promise.all([itemsRequest, totalRequest]);
            let nextCursor: string | null = null;
            if (items.length > limit) {
                nextCursor = items.at(-1)?.id ?? null;
            }

            return {
                items,
                total,
                nextCursor,
            };
        }
    })