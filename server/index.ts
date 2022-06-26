/* eslint-disable import/no-dynamic-require */
import path from 'path';
import express from 'express';
import compression from 'compression';
import morgan from 'morgan';
import { createRequestHandler } from '@remix-run/express';

const BUILD_DIR = path.join(process.cwd(), 'build');

const app = express();

app.use(compression());

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable('x-powered-by');

// Remix fingerprints its assets so we can cache forever.
app.use(
    '/build',
    express.static('public/build', { immutable: true, maxAge: '1y' }),
);

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static('public', { maxAge: '1h' }));

app.use(morgan('tiny'));

/* eslint-disable no-use-before-define */
/* eslint-disable global-require */
app.all(
    '*',
    process.env.NODE_ENV === 'development'
        ? async (req, res, next) => {
            purgeRequireCache();

            return createRequestHandler({
                build: require(BUILD_DIR),
                mode: process.env.NODE_ENV,
            })(req, res, next);
        }
        : createRequestHandler({
            build: require(BUILD_DIR),
            mode: process.env.NODE_ENV,
        }),
);
/* eslint-enable no-use-before-define */
/* eslint-enable global-require */

function getPort(): number {
    if (process.env.PORT != null) {
        return parseInt(process.env.PORT, 10);
    }
    return 3000;
}

const port = getPort();

app.listen(port, '0.0.0.0', () => {
    console.log(`Express server listening on port ${port}`);
});

function purgeRequireCache(): void {
    // purge require cache on requests for "server side HMR" this won't let
    // you have in-memory objects between requests in development,
    // alternatively you can set up nodemon/pm2-dev to restart the server on
    // file changes, but then you'll have to reconnect to databases/etc on each
    // change. We prefer the DX of this, so we've included it for you by default
    // eslint-disable-next-line no-restricted-syntax
    for (const key in require.cache) {
        if (key.startsWith(BUILD_DIR)) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete require.cache[key];
        }
    }
}
