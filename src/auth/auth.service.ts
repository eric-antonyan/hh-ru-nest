import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { SignInDTO, SignUpDTO } from 'src/dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from "bcrypt"
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService
    ) { }

    private async generatePassword(password: string): Promise<string> {
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds)
    }

    private async comparePasswords(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }

    generateToken(id: number, email: string): string {
        const payload = {
            sub: id,
            email
        }

        const token = this.jwt.sign(payload, {
            expiresIn: '1h'
        })

        return token
    }

    async register(dto: SignUpDTO) {
        const { email, password, confirmPassword } = dto

        if (password !== confirmPassword) {
            throw new HttpException('Password does not match', HttpStatus.UNAUTHORIZED)
        }

        try {
            const generatedPassword = await this.generatePassword(password);
            const user = await this.prisma.user.create({
                select: {
                    email: true,
                    id: true
                },
                data: {
                    email,
                    password: generatedPassword
                },
            });

            return user;

        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new HttpException('This email already exists', HttpStatus.CONFLICT);
                }
            }
            console.error(error);
            throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    async login(dto: SignInDTO, res: Response) {
        const { email, password } = dto;

        const isExist = await this.prisma.user.findUnique({
            where: {
                email
            }
        })

        if (!isExist) throw new HttpException('This account not found', HttpStatus.OK);

        const pwMatches = await this.comparePasswords(password, isExist.password);

        if (!pwMatches) throw new HttpException('Password is invalid', HttpStatus.UNAUTHORIZED);

        const access_token = this.generateToken(isExist.id, isExist.email)

        res.cookie("access_token", access_token)

        throw new HttpException({
            access_token
        }, HttpStatus.OK)
    }
}
