import { router } from '..';

import { userRouter } from './user';
import { episodeRouter } from './episode';

export const appRouter = router({
    user: userRouter,
    episodes: episodeRouter,
})

export type AppRouter = typeof appRouter;