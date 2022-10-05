import { 
    generateAccessToken, 
    verifyAccessToken,
    generateRefreshToken,
    verifyRefreshToken
} from './../api/auth/tokenFunctions'
import { castToString } from './../validators';

export default defineEventHandler(async (event) => {
    const accessToken = getCookie(event, 'accessToken');

    if (!accessToken) {
        return
    }

    try {
        const { userId } = verifyAccessToken(accessToken);
        event.context.userId = userId;
    }
    catch (e: unknown) {
        if (!(e instanceof Error) || e.name !== 'TokenExpiredError') {
            return
        }

        const refreshToken = getCookie(event, 'refreshToken');

        if (!refreshToken) {
            return
        }

        const { userId } = await verifyRefreshToken(refreshToken);
        
        setCookie(event, 'accessToken', generateAccessToken(userId), {
            httpOnly: true,
            maxAge: 3 * 60 * 1000, // 3 minutes
        });
    
        const userAgent = castToString(getHeader(event, 'user-agent'), undefined);
        setCookie(event, 'refreshToken', await generateRefreshToken(userId, userAgent), {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        
        event.context.userId = userId;
    }
})
  