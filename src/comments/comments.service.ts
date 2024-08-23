import { faker } from '@faker-js/faker';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AddCommentDTO } from 'src/dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtPayloadType } from 'src/typings';

@Injectable()
export class CommentsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwt: JwtService,
        private readonly config: ConfigService
    ) { }

    private async findUser(sup: number, email: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: sup,
                email
            }
        })

        if (!user) throw new HttpException('User has been deleted!', HttpStatus.NOT_FOUND);

        return user;
    }

    async getAll(cardId: number, req: any) {
        const { token } = req;

        const payload: JwtPayloadType = await this.jwt.verify(token, {
            secret: this.config.get("JWT_SECRET")
        });

        if (!payload) throw new HttpException('Token expired', HttpStatus.UNAUTHORIZED);

        const card = await this.prisma.card.findFirst({
            where: {
                id: Number(cardId),
            },
        });

        if (!card) throw new HttpException(`Card with ID (${cardId}) not found`, HttpStatus.NOT_FOUND);

        const comments = await this.prisma.comment.findMany({
            where: {
                cardId: card.id,
            },
        });

        if (comments.length <= 0) throw new HttpException('Comments not found', HttpStatus.NOT_FOUND);

        return comments;
    }

    async addComment(dto: AddCommentDTO, req: any) {
        const { token } = req;
        const { cardId, content } = dto;

        const payload: JwtPayloadType = await this.jwt.verify(token, {
            secret: this.config.get("JWT_SECRET")
        });

        if (!payload) throw new HttpException('Token expired', HttpStatus.UNAUTHORIZED);

        const { sup, email } = payload;

        const user = await this.findUser(sup, email);

        const isExist = await this.prisma.column.findFirst({
            where: {
                userId: user.id,
                id: Number(cardId),
            }
        });



        if (!isExist) throw new HttpException(`Comment with ID (${cardId}) doesn't exist`, HttpStatus.NOT_FOUND);


        const comment = await this.prisma.comment.create({
            data: {
                cardId: Number(cardId),
                content: content,
                userId: user.id
            }
        });

        throw new HttpException({
            data: comment
        }, HttpStatus.OK);
    }
}
