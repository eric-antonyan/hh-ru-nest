import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { CardsService } from './cards.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CreateCardDTO } from 'src/dto';

@Controller('cards')
export class CardsController {
  constructor(public readonly cardsService: CardsService) { }

  @Get()
  @UseGuards(AuthGuard)
  getAll(@Req() req: any) {
    return this.cardsService.getAll(req)
  }

  @Post()
  @UseGuards(AuthGuard)
  createCard(
    @Req() req: any,
    @Body() dto: CreateCardDTO
  ) {
    return this.cardsService.createCard(dto, req)
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  removeCard(
    @Req() req: any,
    @Param('id') id: number
  ) {
    return this.cardsService.remove(req, id);
  }
}
