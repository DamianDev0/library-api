import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UseFilters, UseGuards } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { ApiTags } from '@nestjs/swagger';
import { ResponseInterceptor } from '../common/interceptor/response.interceptor';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { ApiKeyGuard } from '../common/guard/api-key.guard';

@ApiTags('Books')
@Controller('book')
@UseGuards(ApiKeyGuard)
@UseInterceptors(ResponseInterceptor)
@UseFilters(HttpExceptionFilter)
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  async create(@Body() createBookDto: CreateBookDto) {
    return await this.bookService.create(createBookDto);
  }

  @Get()
  async findAll() {
    return await this.bookService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.bookService.findById(id);
  }

  @Get('author/:author')
  async findByAuthor(@Param('author') author: string) {
    return await this.bookService.findByAuthor(decodeURIComponent(author));
  }

  @Get('genre/:genre')
  async findByGenre(@Param('genre') genre: string) {
    return await this.bookService.findByGenre(decodeURIComponent(genre));
  }

  @Get('publicationDate/:publicationDate')
  async findByDate(@Param('publicationDate') date: string) {
    return await this.bookService.findByDate(decodeURIComponent(date));
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.bookService.delete(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return await this.bookService.update(id, updateBookDto);
  }
}
