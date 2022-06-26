import type { ActionFunction, LoaderFunction } from '@remix-run/node';

import { Form, useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/node';

import authenticator from '~/services/auth.server';
import sessionStorage from '~/services/session.server';

export default function LoginPage() {
    const loaderData = useLoaderData();
    console.log(loaderData);
    return (
        <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.4' }}>
            <h1>
                Welcome to Remix-Auth Example
            </h1>

            <Form method="post">
                <input
                    name="username"
                    placeholder="username"
                    required
                    type="text"
                />

                <input
                    name="email"
                    placeholder="email"
                    required
                    type="email"
                />

                <input
                    autoComplete="current-password"
                    name="password"
                    placeholder="password"
                    required
                    type="password"
                />

                <button>
                    Register
                </button>
            </Form>

            <div>
                {loaderData?.error ? <p>
                    ERROR:
                    {loaderData?.error?.message}
                </p> : null}
            </div>
        </div>
    );
}

export const loader: LoaderFunction = async ({ request }) => {
    await authenticator.isAuthenticated(request, {
        successRedirect: '/',
    });

    const session = await sessionStorage.getSession(
        request.headers.get('Cookie'),
    );

    const error = session.get('sessionErrorKey');
    return json<any>({ error });
};

export const action: ActionFunction = async ({ request, context }) => authenticator.authenticate('register-form', request, {
    successRedirect: '/',
    failureRedirect: '/register',
    throwOnError: true,
    context,
});
