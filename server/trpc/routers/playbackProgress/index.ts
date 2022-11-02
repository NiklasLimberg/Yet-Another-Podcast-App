import { router, publicProcedure } from '~/server/trpc';
import prisma from '~/server/prisma-db';

import { playbackProgressInput, playbackProgressOutput } from '~~/types/PlaybackProgress';
import { TRPCError } from '@trpc/server';

export const playbackProgressRouter = router({
    write: publicProcedure.input(playbackProgressInput).output(playbackProgressOutput).mutation(async ({ input, ctx }) => {
        const { episodeId, progress, eventTimestamp } = input;
        const { userId } = ctx;
        
        if(!userId) {
            throw new TRPCError({ 
                code: 'UNAUTHORIZED', 
                message: 'Not authenticated',
            });
        }

        const existingProgress = await prisma.playbackProgress.findFirst({
            where: {
                episodeId: episodeId,
                userId: userId,
            },
        });

        if (!existingProgress) {
            return prisma.playbackProgress.create({
                data: {
                    episodeId,
                    progress,
                    userId: userId,
                },
            });
        }

        if(existingProgress.updated.getTime() < eventTimestamp.getTime()) {
            return prisma.playbackProgress.update({
                where: {
                    userId_episodeId: {
                        userId: userId,
                        episodeId,
                    },
                },
                data: {
                    progress,
                    updated: eventTimestamp,
                },
            });
        }

        return existingProgress;
    }),
});