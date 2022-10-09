import { castToString } from '~/server/validators';
import prisma from '~/server/prisma-db';
import trpc from '@trpc/server';
import zod from 'zod';
import bcrypt from 'bcrypt';

import type { inferAsyncReturnType } from '@trpc/server'
import type { createContext } from '~/server/trpc'

import {
    generateAccessToken,
    deleteRefreshToken,
    generateRefreshToken
} from './tokenFunctions';

export const userRouter = trpc.router<inferAsyncReturnType<typeof createContext>>()
    .query('me', {
        async resolve({ ctx }) {
            const userId = ctx.userId;

            if (!userId) {
                throw new trpc.TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'Not authenticated',
                });
            }

            try {
                return await prisma.user.findUniqueOrThrow({ 
                    where: { 
                        id: userId
                    }, 
                    select: { 
                        email: true, username: true
                    }
                });
            } catch (error) {
                throw new trpc.TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Could not find user',
                })
            }
        }
    })

    .query('sessions', {
        async resolve({ ctx }) {
            const userId = ctx.userId;

            if (!userId) {
                throw new trpc.TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'Not authenticated',
                });
            }

            try {
                return await prisma.refreshToken.findMany({
                    where: {
                        userId,
                    },
                    select: {
                        id: true,	
                        browserIsMobile: true,
                        browserName: true,
                        browserVersion: true,
                        browserOS: true,
                    },
                });
            } catch (error) {
                throw new trpc.TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Could not find sessions',
                })
            }
        }
    })

    .mutation('login', {
        input:  zod.object({
            email: zod.string().email(),
            password: zod.string()
        }),
        async resolve({ input, ctx }) {
            const { email, password } = input;
            const user = await prisma.user.findUniqueOrThrow({ where: { email } })

            const match = await bcrypt.compare(password, user.password)
    
            if (!match) {
                throw new Error('Password does not match')
            }

            setCookie(ctx.event, 'accessToken', generateAccessToken(user.id), {
                httpOnly: true,
                maxAge: 3 * 60 * 1000, // 3 minutes
            });
            
            const userAgent = castToString(getHeader(ctx.event, 'user-agent'), undefined);
            setCookie(ctx.event, 'refreshToken', await generateRefreshToken(user.id, userAgent), {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });
        }
    })
    .mutation('register', {
        input: zod.object({
            email: zod.string().email(),
            password: zod.string().min(8).max(256),
            username: zod.string().min(8).max(256),
        }),
        async resolve({ input, ctx }) {
            const { email, password, username } = input;

            const hashedPassword = await bcrypt.hash(password, 12)

            const user = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    username,
                }
            })
    
            setCookie(ctx.event, 'accessToken', generateAccessToken(user.id), {
                httpOnly: true,
                maxAge: 3 * 60 * 1000, // 3 minutes
            });
    
            const userAgent = castToString(getHeader(ctx.event, 'user-agent'), undefined);
            setCookie(ctx.event, 'refreshToken', await generateRefreshToken(user.id, userAgent), {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });
        }
    })
    
