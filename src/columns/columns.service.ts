import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CreateColumnDTO } from 'src/dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtPayloadType } from 'src/typings';

@Injectable()
export class ColumnsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwt: JwtService,
        private readonly config: ConfigService
    ) { }

    async findUser(sup: number, email: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: sup,
                email
            }
        })

        if (!user) throw new HttpException('User has been deleted!', HttpStatus.NOT_FOUND);

        return user;
    }

    async createColumn(dto: CreateColumnDTO, req: any) {
        const { token } = req;

        const payload: JwtPayloadType = await this.jwt.verify(token, {
            secret: this.config.get("JWT_SECRET")
        });

        if (!payload) throw new HttpException('Token expired', HttpStatus.UNAUTHORIZED)

        const { sup, email } = payload;

        const user = await this.findUser(sup, email);

        const isExist = await this.prisma.column.findFirst({
            where: {
                userId: user.id,
                title: dto.title
            }
        })

        if (isExist) throw new HttpException(`column (${dto.title}) is exist`, HttpStatus.CONFLICT)

        const column = await this.prisma.column.create({
            data: {
                title: dto.title,
                userId: user.id
            }
        })

        if (!column) throw new HttpException("Column could not be created", HttpStatus.UNPROCESSABLE_ENTITY);

        return column;

    }

    async getAll(req: any) {
        const { token } = req;
        console.log(token);


        const payload: JwtPayloadType = await this.jwt.verify(token, {
            secret: this.config.get("JWT_SECRET")
        });

        if (!payload) throw new HttpException('Token expired', HttpStatus.UNAUTHORIZED)

        const { sup, email } = payload;

        const user = await this.findUser(sup, email);

        const columns = await this.prisma.column.findMany({
            where: {
                userId: user.id
            }
        })

        if (columns.length <= 0) throw new HttpException('Columns not found', HttpStatus.NOT_FOUND);

        return columns;
    }

    async remove(req: any, id: number) {
        const { token } = req;

        const payload: JwtPayloadType = await this.jwt.verify(token, {
            secret: this.config.get("JWT_SECRET")
        });

        if (!payload) throw new HttpException('Token expired', HttpStatus.UNAUTHORIZED)

        const { sup, email } = payload;

        const user = await this.findUser(sup, email);

        const isExist = await this.prisma.column.findFirst({
            where: {
                userId: user.id,
                id: Number(id),
            }
        })

        if (!isExist) throw new HttpException(`Column with ID (${id}) doesn't exist`, HttpStatus.NOT_FOUND);

        await this.prisma.column.delete({
            where: {
                id: Number(id),
            }
        })

        await this.prisma.card.deleteMany({
            where: {
                columnId: Number(id)
            }
        })

        throw new HttpException('Column removed', HttpStatus.OK)
    }
}
