import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CreateCardDTO } from 'src/dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtPayloadType } from 'src/typings';
import { faker } from '@faker-js/faker';

@Injectable()
export class CardsService {
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
        });

        if (!user) throw new HttpException('User has been deleted!', HttpStatus.NOT_FOUND);

        return user;
    }

    async createCard(dto: CreateCardDTO, req: any) {
        const { token } = req;
        const { columnId } = dto;

        const payload: JwtPayloadType = await this.jwt.verify(token, {
            secret: this.config.get("JWT_SECRET")
        });

        if (!payload) throw new HttpException('Token expired', HttpStatus.UNAUTHORIZED);

        const { sup, email } = payload;

        const user = await this.findUser(sup, email);

        const isExist = await this.prisma.column.findFirst({
            where: {
                userId: user.id,
                id: Number(columnId),
            }
        });



        if (!isExist) throw new HttpException(`Column with ID (${columnId}) doesn't exist`, HttpStatus.NOT_FOUND);

        const title = faker.word.adjective();

        const card = await this.prisma.card.create({
            data: {
                columnId: Number(columnId),
                title,
                userId: user.id
            }
        });

        throw new HttpException({
            data: card
        }, HttpStatus.OK);
    }

    async getAll(req: any) {
        const { token } = req;

        const payload: JwtPayloadType = await this.jwt.verify(token, {
            secret: this.config.get("JWT_SECRET")
        });

        if (!payload) throw new HttpException('Token expired', HttpStatus.UNAUTHORIZED)

        const { sup, email } = payload;

        const user = await this.findUser(sup, email);

        const cards = await this.prisma.card.findMany({
            where: {
                userId: user.id
            }
        })

        if (cards.length <= 0) throw new HttpException('Cards not found', HttpStatus.NOT_FOUND);

        return cards;
    }

    async remove(req: any, id: number) {
        const { token } = req;

        const payload: JwtPayloadType = await this.jwt.verify(token, {
            secret: this.config.get("JWT_SECRET")
        });

        if (!payload) throw new HttpException('Token expired', HttpStatus.UNAUTHORIZED)

        const { sup, email } = payload;

        const user = await this.findUser(sup, email);

        if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND)

        const card = await this.prisma.card.findFirst({
            where: {
                id: Number(id),
            }
        })

        if (!card) throw new HttpException(`Card with ID (${id}) doesn't exist`, HttpStatus.NOT_FOUND);

        await this.prisma.card.delete({
            where: {
                id: Number(id),
            }
        })

        await this.prisma.comment.deleteMany({
            where: {
                cardId: Number(id)
            }
        })

        throw new HttpException('Card removed', HttpStatus.OK)
    }
}
