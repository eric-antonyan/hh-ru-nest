import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from "jsonwebtoken";

@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers['authorization'];

        if (!authHeader) {
            throw new UnauthorizedException('Authorization header is missing');
        }

        const token = authHeader.replace(/^Bearer\s+/, '');

        request.token = token;

        if (this.validateToken(token)) {
            return true;
        } else {
            throw new UnauthorizedException('Invalid token');
        }
    }

    private validateToken(token: string): boolean {
        const secretKey = process.env.JWT_SECRET;

        if (!secretKey) {
            throw new UnauthorizedException('JWT secret key is not defined');
        }

        try {
            const data = jwt.verify(token, secretKey);
            return !!data;
        } catch (err) {
            console.error('Token verification error:', err);
            throw new UnauthorizedException('Invalid token');
        }
    }
}
