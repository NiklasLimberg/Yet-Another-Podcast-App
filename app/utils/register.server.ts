import { AuthorizationError } from 'remix-auth';
import argon2 from "argon2";

import { db } from "./db.server";

export default async function login(email: string, password: string, username: string) {
    if (typeof email !== 'string' || email.length < 4) {
        throw new AuthorizationError('Registration Credentials: Email is required')
    }
      
    if (typeof password !== 'string' || password.length < 8) {
        throw new AuthorizationError('Registration Credentials: Password is required')
    }

    if(typeof password !== 'string' || password.length < 8) {
        throw new AuthorizationError('Registration Error: Username is required')
    }

    const user = await db.user.findUnique({
        where: { email },
    });

    if (user) {
        throw new AuthorizationError('Registration Error: User already exists!')
    };

    const passwordHash = await argon2.hash(
        password
    );

    const createdUser = await db.user.create({
        data: {
            email,
            username,
            passwordHash
        }
    })

    return { id: createdUser.id, email };
}