import { defineStore } from 'pinia';

import { client } from '~~/utils/trpcClient';

import { TRPCClientError } from '@trpc/client';

interface User {
    email: string;
    username: string;
}

export const useAuthStore = defineStore('auth-store', () => {
    const user = ref<User | null>();

    async function getCurrentUser() {
        try {
            user.value = await client.user.me.query();
        } catch (error) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (error.cause === 'UNAUTHORIZED') {
                user.value = null;
            }

            // todo: fallback to idb
        }
    }

    getCurrentUser();

    return {
        user,
    };
});