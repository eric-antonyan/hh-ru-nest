import { Module } from "@nestjs/common";
import { PrismaService } from './prisma.service';
import { ConfigModule } from "@nestjs/config"
import { JwtModule } from "@nestjs/jwt"

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        JwtModule.register({
            secret: 'anhnarinegushakel',
        })
    ],
    providers: [PrismaService]
})
export class PrismaModule { }