import { Global, Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from './users/users.module';
import { ColumnsModule } from './columns/columns.module';
import { CardsModule } from './cards/cards.module';
import { CommentsModule } from './comments/comments.module';

@Global()
@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true
    }),
    JwtModule.register({
      secret: 'anhnarinegushakel', // Provide your secret key here
      signOptions: { expiresIn: '60m' }, // Token expiration time
    }),
    UsersModule,
    ColumnsModule,
    CardsModule,
    CommentsModule,
  ],
  exports: [JwtModule]
})
export class AppModule { }
