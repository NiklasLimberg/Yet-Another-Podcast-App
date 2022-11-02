import type { NitroApp } from 'nitropack';
import { resolveHTTPResponse } from '@trpc/server';
import { createURL } from 'ufo';
import { readBody, setHeader } from 'h3';

import { appRouter } from '../trpc/routers/appRouter';
import { createContext } from '../trpc/context';

export default function (nitroApp: NitroApp) {
    const trpcEndpoint = '/api/trpc';
    const pathSliceLength = trpcEndpoint.length + 1;

    nitroApp.router.add(`${trpcEndpoint}/*`, eventHandler(async function (event) {
        if (typeof event.req.url !== 'string') {
            throw new TypeError('[nuxt-trcp-adapter] req.url is not a string');
        }

        const url = createURL(event.req.url);
        const method = event.req.method ?? 'GET';

        const response = await resolveHTTPResponse({
            router: appRouter,
            req: {
                method,
                headers: event.req.headers,
                body: method === 'GET' ? null : await readBody(event),
                query: url.searchParams,
            },
            path: url.pathname.slice(pathSliceLength),
            createContext: () => createContext(event),
        });

        const { status, headers, body } = response;

        event.res.statusCode = status;

        if (headers) {
            Object.entries(headers).forEach(([key, value]) => {
                if (value) {
                    setHeader(event, key, value);
                }
            });
        }

        return body;
    }), ['get', 'post']);
}