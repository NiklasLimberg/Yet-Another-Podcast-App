import { router } from '..';

import { userRouter } from './user';
import { episodeRouter } from './episode';
import { playbackProgressRouter } from './playbackProgress';

export const appRouter = router({
    user: userRouter,
    episodes: episodeRouter,
    progress: playbackProgressRouter,
});

export type AppRouter = typeof appRouter;