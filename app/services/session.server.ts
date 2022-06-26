import { createCookieSessionStorage } from '@remix-run/node';

export default createCookieSessionStorage({
    cookie: {
        name: 'user_pass_session',
        sameSite: 'lax',
        path: '/',
        httpOnly: true,
        secrets: ['s3cr3t'], // replace this with an actual secret
        secure: process.env.NODE_ENV === 'production',
    },
});
