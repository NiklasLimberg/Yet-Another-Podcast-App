import { AuthorizationError } from 'remix-auth';
import argon2 from "argon2";

import { db } from "./db.server";

const errorMessage = 'Bad Credentials: Username/Password combination is incorrect'

export default async function login(email: string, password: string) {
    if (!email || email?.length === 0) {
        throw new AuthorizationError('Bad Credentials: Email is required')
    } 
    if (typeof email !== 'string') {
        throw new AuthorizationError('Bad Credentials: Email must be a string')
    }
      
    if (!password || password?.length === 0) {
        throw new AuthorizationError('Bad Credentials: Password is required')
    }
    if (typeof password !== 'string') {
        throw new AuthorizationError('Bad Credentials: Password must be a string')
    }

    const user = await db.user.findUnique({
        where: { email },
    });

    if (!user) {
        throw new AuthorizationError(errorMessage)
    };

    const isCorrectPassword = await argon2.verify(
        user.passwordHash,
        password
    );

    if (!isCorrectPassword) {
        throw new AuthorizationError(errorMessage)
    };

    return { id: user.id, email };
}