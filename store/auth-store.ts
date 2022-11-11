import { TRPCClientError } from '@trpc/client';
import { defineStore } from 'pinia';

import { client } from '~~/utils/trpcClient';

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
            if (error instanceof TRPCClientError) {
                console.log(error.message);
            }

            // todo: fallback to idb
        }
    }

    getCurrentUser();

    return {
        user,
    };
});