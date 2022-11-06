import { PrismaClient } from '@prisma/client';

import bcrypt from 'bcrypt';

const db = new PrismaClient();

db.$connect();

async function seed() {
    await db.user.create({
        data: {
            username: 'Test user',
            email: 'test@test.de',
            password: await bcrypt.hash('test', 8),
        },
    });
}

seed();
