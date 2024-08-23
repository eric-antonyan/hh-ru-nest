import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { AddCommentDTO } from 'src/dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) { }

  @Post()
  @UseGuards(AuthGuard)
  createComment(@Body() dto: AddCommentDTO, @Req() req: any) {
    return this.commentsService.addComment(dto, req)
  }

  @Get(':cardId')
  @UseGuards(AuthGuard)
  getAll(
    @Param("cardId") cardId: number,
    @Req() req: any
  ) {
    return this.commentsService.getAll(cardId, req)
  }

  @Patch(":id")
  @UseGuards(AuthGuard)
  update(@Param("id") id: number) {

  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  remove(@Param("id") id: number) {

  }
}
