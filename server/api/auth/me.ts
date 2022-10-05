import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event): Promise<{email: string, username: string}> => {
    try {
        const userId = event.context.userId;

        if (!userId) {
            throw new Error('User not in context');
        }

        return await prisma.user.findUniqueOrThrow({ where: { id: userId }, select: { email: true, username: true } });
    } catch (error) {
        throw new Error('Could not get user')
    }
})