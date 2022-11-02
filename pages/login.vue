<template>
    <div>
        <h1>
            Sign into an account
        </h1>
  
        <form
            @submit.prevent="login"
        >
            <div>
                <label
                    for="email-address"
                    class="sr-only"
                >Email address
                </label>
                <input
                    id="email-address"
                    v-model="email"
                    name="email"
                    type="email"
                    autocomplete="email"
                    required
                    placeholder="Email address"
                >
            </div>
            <div>
                <label
                    for="password"
                    class="sr-only"
                >Password</label>
                <input
                    id="password"
                    v-model="password"
                    name="password"
                    autocomplete="password"
                    required
                    placeholder="Password"
                >
            </div>        
            <div>
                <button
                    type="submit"
                >
                    Sign in
                </button>
            </div>
        </form>
    </div>
</template>
  
<script lang="ts" setup>
import { client } from '~~/utils/trpcClient';

const email = ref('');
const password = ref('');

async function login() {
    await client.user.login.mutate({ 
        email: email.value,
        password: password.value,
    });
}
</script>