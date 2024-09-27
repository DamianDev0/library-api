import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto'

describe('BookController', () => {
  let bookController: BookController;
  let bookService: BookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      providers: [
        {
          provide: BookService,
          useValue: {
            findAll: jest.fn(() => ['book1', 'book2']),
            findById: jest.fn((id: string) => `book ${id}`),
            create: jest.fn((createBookDto: CreateBookDto) => createBookDto),
            update: jest.fn((id: string, updateBookDto: CreateBookDto) => ({
              id,
              ...updateBookDto,
            })),
            delete: jest.fn((id: string) => `Book with id ${id} deleted`),
            findByAuthor: jest.fn((author: string) => [author]),
            findByGenre: jest.fn((genre: string) => [genre]),
            findByDate: jest.fn((date: string) => [date])

          },
        },
      ],
    }).compile();

    bookController = module.get<BookController>(BookController);
    bookService = module.get<BookService>(BookService);
  });

  describe('findAll', () => {
    it('should return an array of books', async () => {
      const result = await bookController.findAll();
      expect(result).toEqual(['book1', 'book2']);
      expect(bookService.findAll).toHaveBeenCalled(); 
    });
  });

  describe('findOne', () => {
    it('should return a single book by id', async () => {
      const result = await bookController.findOne('60d5ec49f0d3e212f06b30bc');
      expect(result).toEqual('book 60d5ec49f0d3e212f06b30bc');
      expect(bookService.findById).toHaveBeenCalledWith('60d5ec49f0d3e212f06b30bc');
    });
  });

  describe('create', () => {
    it('should create a book and return it', async () => {
      const createBookDto: CreateBookDto = {
          title: 'New Book',
          author: 'Author',
          publicationDate: '',
          genre: 'book genre'
      };
      const result = await bookController.create(createBookDto);
      expect(result).toEqual(createBookDto);
      expect(bookService.create).toHaveBeenCalledWith(createBookDto); 
    });
  });

  describe('update', () => {
    it('should update a book and return the updated book', async () => {
      const updateBookDto: CreateBookDto = {
          title: 'Updated Book', author: 'New Author',
          publicationDate: '',
          genre: 'book genre'
      };
      const result = await bookController.update('1', updateBookDto);
      expect(result).toEqual({
        id: '1',
        ...updateBookDto,
      });
      expect(bookService.update).toHaveBeenCalledWith('1', updateBookDto); 
    });
  });

  describe('findByAuthor', () => {
    it('should return an array of books by author', async () => {
      const result = await bookController.findByAuthor('Author');
      expect(result).toEqual(['Author']);
      expect(bookService.findByAuthor).toHaveBeenCalledWith('Author');
    });
  })

  describe('findByGenre', () => {
    it('should return an array of books by genre', async () => {
      const result = await bookController.findByGenre('book genre');
      expect(result).toEqual(['book genre']);
      expect(bookService.findByGenre).toHaveBeenCalledWith('book genre');
    });
  })

  describe('findByDate', () => {
    it('should return an array of books by publication date', async () => {
      const result = await bookController.findByDate('');
      expect(result).toEqual(['']);
      expect(bookService.findByDate).toHaveBeenCalledWith('');
    });
  })

  describe('remove', () => {
    it('should delete a book and return a confirmation message', async () => {
      const result = await bookController.remove('1');
      expect(result).toEqual('Book with id 1 deleted');
      expect(bookService.delete).toHaveBeenCalledWith('1'); 
    });
  });
});
