import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Book } from './schema/book.schema';
import { BaseService } from '../common/service/base.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class BookService extends BaseService<Book> {
    constructor(@InjectModel(Book.name) private readonly bookModel: Model<Book>) {
        super(bookModel);
    }


    private validateMongoId(id: string) {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException('Invalid ID format');
        }
    }

    private validateAvailableBooks(books: Book[]): void {
        if (books.length === 0) {
            throw new BadRequestException('No books available at this time');
        }
    }

    private validateBooksFound(book: Book | Book[] | null, value: string, field: string): void {
        if (!book) {
            throw new NotFoundException(`Book with ${field} "${value}" not found`);
        }
    }

    async create(createBookDto: CreateBookDto): Promise<Book> {
        return super.create(createBookDto);
    }

    async update(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
        this.validateMongoId(id);

        const existingBook = await super.findById(id);
        this.validateBooksFound(existingBook, id, 'id');

        return super.update(id, updateBookDto);
    }


    async delete(id: string): Promise<Book> {
        this.validateMongoId(id);

        const book = await super.findById(id);
        this.validateBooksFound(book, id, 'id');

        return super.delete(id);
    }

    async findAll(paginationDto: PaginationDto): Promise<Book[]> {
        return super.findAll(paginationDto);
    }


    async findById(id: string): Promise<Book> {
        this.validateMongoId(id);

        const book = await super.findById(id);
        this.validateBooksFound(book, id, 'id');

        return book;
    }

    async findByAuthor(author: string): Promise<Book[]> {
        const books = await this.bookModel.find({ author }).exec();
        this.validateAvailableBooks(books);
        return books;
    }


    async findByGenre(genre: string): Promise<Book[]> {
        const books = await this.bookModel.find({ genre }).exec();
        this.validateAvailableBooks(books);

        return books;
    }


    async findByDate(date: string): Promise<Book[]> {
        const [month, day, year] = date.split('-');
        const formattedDate = `${year}-${month}-${day}`;

        const books = await this.bookModel.find({
            publicationDate: formattedDate
        }).exec();

        this.validateAvailableBooks(books);

        return books;
    }
}
