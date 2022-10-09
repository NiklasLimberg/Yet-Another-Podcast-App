import jwt from 'jsonwebtoken'
import browser from 'browser-detect'

import { PrismaClient } from '@prisma/client'
import { v4 as generateUUID } from 'uuid'
import type { AccessTokenContent, RefreshTokenContent }  from '../types/JsonWebToken'

const prisma = new PrismaClient()

export function generateAccessToken(userId: string): string {
    return jwt.sign({ userId }, 'youraccesstokensecret', { expiresIn: '2min' })
}

export function verifyAccessToken(token: string): AccessTokenContent {
    return jwt.verify(token, 'youraccesstokensecret') as AccessTokenContent
}

export async function generateRefreshToken(userId: string, userAgent?: string): Promise<string> {
    const tokenId = generateUUID()

    const detectionResult = browser(userAgent);

    const refreshToken = jwt.sign({ userId }, 'refreshTokenSecret', { jwtid: tokenId, expiresIn: '30d' })

    await prisma.refreshToken.create({
        data: {
            id: tokenId,
            browserName: detectionResult.name,
            browserVersion: detectionResult.version,
            browserIsMobile: detectionResult.mobile,
            browserOS: detectionResult.os,
            userId,
        }
    })

    return refreshToken; 
}

export async function verifyRefreshToken(token: string): Promise<RefreshTokenContent> {
    const tokenContent = jwt.verify(token, 'refreshTokenSecret') as RefreshTokenContent

    await prisma.refreshToken.findUniqueOrThrow({
        where: { 
            id_userId: { 
                id: tokenContent.jti, 
                userId: tokenContent.userId
            } 
        }
    })  

    return tokenContent;
}

export async function deleteRefreshToken(tokenId: string): Promise<void> {
    await prisma.refreshToken.delete({
        where: {
            id: tokenId
        }
    })
}