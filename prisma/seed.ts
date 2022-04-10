import { PrismaClient } from "@prisma/client";

import argon2 from "argon2";

const db = new PrismaClient();

db.$connect()

async function seed() {
    await db.user.create({
        data: {
            username: 'Test user',
            email: 'test@test.de',
            passwordHash: await argon2.hash('test')
        }
    })
}

seed();
