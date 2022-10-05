import { generateAccessToken, generateRefreshToken } from './tokenFunctions'
import { castToString } from '../../validators'
import prisma from  '../../prisma-db'
import bcrypt from 'bcrypt'
import zod from 'zod'

const loginSchema = zod.object({
    email: zod.string().email(),
    password: zod.string()
})


const loginErrorMessage = 'Invalid username or password'

export default defineEventHandler(async (event): Promise<void> => {
    try {
        const requestBody = useBody(event)
        const { email, password } = loginSchema.parse(requestBody)

        const user = await prisma.user.findUniqueOrThrow({ where: { email } })

        const match = await bcrypt.compare(password, user.password)

        if (!match) {
            throw new Error('Password does not match')
        }

        setCookie(event, 'accessToken', generateAccessToken(user.id), {
            httpOnly: true,
            maxAge: 3 * 60 * 1000, // 3 minutes
        });
    
        const userAgent = castToString(getHeader(event, 'user-agent'), undefined);
        setCookie(event, 'refreshToken', await generateRefreshToken(user.id, userAgent), {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
    } catch (e) {
        throw new Error(loginErrorMessage)
    }
});