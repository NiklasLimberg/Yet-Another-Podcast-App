import type { inferAsyncReturnType } from '@trpc/server';
import type { CompatibilityEvent } from 'h3'

import { TRPCError } from '@trpc/server'
import { castToString } from '../validators';
import { 
    generateAccessToken, 
    verifyAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
    deleteRefreshToken
} from './tokenFunctions'

export const createContext = async (event: CompatibilityEvent) => {
    const accessToken = getCookie(event, 'accessToken');
    
    if (!accessToken) {
        return { event };
    }
    
    try {
        const { userId } = verifyAccessToken(accessToken);
        return { event, userId };
    }
    catch (e: unknown) {
        const refreshToken = getCookie(event, 'refreshToken');
    
        if (!(e instanceof Error) || e.name !== 'TokenExpiredError' || !refreshToken) {
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'Could not verify token',
            });
        }
    
        const { userId, jti } = await verifyRefreshToken(refreshToken);

        await deleteRefreshToken(jti);
            
        setCookie(event, 'accessToken', generateAccessToken(userId), {
            httpOnly: true,
            maxAge: 3 * 60 * 1000, // 3 minutes
        });
        
        const userAgent = castToString(getHeader(event, 'user-agent'), undefined);
        setCookie(event, 'refreshToken', await generateRefreshToken(userId, userAgent), {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
            
        return { event, userId };
    }
}

export type Context = inferAsyncReturnType<typeof createContext>;