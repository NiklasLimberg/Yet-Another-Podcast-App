import { OAuth2Client } from 'google-auth-library';
import { castToString } from '../../validators'

const runtimeConfig = useRuntimeConfig()

const client = new OAuth2Client(runtimeConfig.googleSignInClientId);

export default defineEventHandler(async (event): Promise<void> => {
    const { idToken: idTokenRaw } = useQuery(event.req);

    const idToken = castToString(idTokenRaw, false);
    
    if(!idToken) {
        throw new Error('No idToken provided');
    }
    
    try {    
        const ticket = await client.verifyIdToken({
            idToken,
            audience: runtimeConfig.googleSignInClientId,
        });
        const payload = ticket.getPayload();
        if (!payload) {
            throw new Error();
        }
    } catch (err) {
        throw new Error('Could not verify token');
    }
})



