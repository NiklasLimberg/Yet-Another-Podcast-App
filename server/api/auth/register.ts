import { generateAccessToken, generateRefreshToken } from './tokenFunctions'
import { castToString } from '../../validators'
import prisma from  '../../prisma-db'
import bcrypt from 'bcrypt'
import zod from 'zod'

const registerSchema = zod.object({
    email: zod.string().email(),
    password: zod.string().min(8).max(256),
    username: zod.string().min(8).max(256),
})


export default defineEventHandler(async (event): Promise<void> => {
    try {
        const requestBody = useBody(event)
        const { email, password, username } = registerSchema.parse(requestBody)

        const hashedPassword = await bcrypt.hash(password, 12)

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                username,
            }
        })

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
        throw new Error('Could not register user')
    }
})