import type { AppRouter } from '../server/trpc/routers/appRouter'

import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import  { FetchError } from 'ohmyfetch'
import superjson from 'superjson'

export const useTRPC = () => createTRPCProxyClient<AppRouter>({
    links: [
        httpBatchLink({
            url: '/api/trpc',
            fetch: async (input, init) => {
                try {
                    const response = await globalThis.$fetch.raw(input.toString(), init)
          
                    return {
                        ...response,
                        json: () => Promise.resolve(response._data)
                    }
                } catch (e) {
                    if (e instanceof FetchError && e.response) {
                        return e.response
                    }
          
                    throw e
                }
            },
        })
    ],
    transformer: superjson
})