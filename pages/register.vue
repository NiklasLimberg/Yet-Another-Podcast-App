<template>
    <div>
        <h1>
            Create an account
        </h1>
  
        <form
            @submit.prevent="register"
        >
            <div>
                <label for="username">
                    Username
                </label>
                <input
                    id="username"
                    v-model="username"
                    name="username"
                    autocomplete="username"
                    required
                    placeholder="username"
                >
            </div>
            <div>
                <label for="email-address">
                    Email address
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
                <label for="password">
                    Password
                </label>
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

const username = ref('');
const email = ref('');
const password = ref('');

async function register() {
    await client.user.register.mutate({ 
        username: username.value,
        email: email.value,
        password: password.value,
    });
}
</script>