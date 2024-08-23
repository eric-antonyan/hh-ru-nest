import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ColumnsService } from './columns.service';
import { CreateColumnDTO } from 'src/dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('columns')
export class ColumnsController {
  constructor(private readonly columnsService: ColumnsService) { }

  @Post()
  @UseGuards(AuthGuard)
  createColumn(
    @Body() dto: CreateColumnDTO,
    @Req() req: any
  ) {
    return this.columnsService.createColumn(dto, req)
  }

  @Get()
  @UseGuards(AuthGuard)
  getAll(@Req() req: any) {
    return this.columnsService.getAll(req);
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  delete(
    @Req() req: any,
    @Param("id") id: number
  ) {
    return this.columnsService.remove(req, id);
  }
}
