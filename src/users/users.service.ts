import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from "@prisma/client"
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtPayloadType } from 'src/typings';

@Injectable()
export class UsersService {
    constructor(
        private readonly jwt: JwtService,
        private readonly prisma: PrismaService,
        private config: ConfigService
    ) { }

    private async verifyToken(token: string): Promise<JwtPayloadType> {
        try {
            const data = await this.jwt.verifyAsync(token, {
                secret: this.config.get("JWT_SECRET")
            });
            return data;
        } catch (error) {
            throw new Error('Token verification failed');
        }
    }


    getHashedPassword(pw: string): string {
        let str = "";

        for (let i = 0; i < pw.length; i++) {
            if (i < 6) {
                str += pw[i]
            } else if (i < 10) {
                str += "*"
            }
        }

        str += '...'

        return str;
    }

    async getMe(req: any) {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            throw new Error('Token not provided');
        }

        const jwtPayload = await this.verifyToken(token);
        const { sup, email } = jwtPayload;

        const user = await this.prisma.user.findUnique({
            select: {
                id: true,
                email: true,
                password: true,
            },
            where: {
                id: sup,
                email
            }
        });

        const hashedPassword = this.getHashedPassword(user.password);
        user.password = hashedPassword;

        return {
            you: user,
            api: {
                columns: {
                    "POST": "http://localhost:6000/columns",
                    "GET": "http://localhost:6000/columns",
                    "DELETE": "http://localhost:6000/columns/{id}"
                },
                cards: {
                    "POST": "http://localhost:6000/cards",
                    "GET": "http://localhost:6000/cards",
                    "DELETE": "http://localhost:6000/cards/{id}"
                }
            }
        };
    }

}
