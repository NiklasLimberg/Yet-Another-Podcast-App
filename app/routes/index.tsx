import type { ActionFunction, LoaderFunction } from '@remix-run/node';

import { Form, useLoaderData } from '@remix-run/react';
import authenticator from '~/services/auth.server';

export const loader: LoaderFunction = async ({ request }) => authenticator.isAuthenticated(request);

export const action: ActionFunction = async ({ request }) => {
    await authenticator.logout(request, { redirectTo: '/login' });
};

export default function Index() {
    const data = useLoaderData();
    return (
        <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.4' }}>
            <h1>
                Welcome to Remix Protected Dashboard
            </h1>

            <p>
                {data?.email}
                {data?.token}
            </p>

            <Form method="post">
                <button>
                    Log Out
                </button>
            </Form>
        </div>
    );
}
