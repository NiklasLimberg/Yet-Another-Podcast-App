import type JwtPayload from '@types/jsonwebtoken';

export interface AccessTokenContent extends JwtPayload {
    jwtid: string;
    userId: string
}

export interface RefreshTokenContent extends JwtPayload {
    jti: string;
    userId: string
}