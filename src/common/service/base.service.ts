import { Injectable, NotFoundException } from '@nestjs/common';
import { Model, Document } from 'mongoose';
import { PaginationDto } from '../dtos/pagination.dto';

@Injectable()
export class BaseService<T extends Document> {
  constructor(private readonly model: Model<T>) {}

  async create(createDto: Partial<T>): Promise<T> {
    return this.model.create(createDto);
  }

  async findAll(paginationDto: PaginationDto): Promise<T[]> {

    const { page = 1, limit = 10 } = paginationDto;

    const startIndex = (page - 1) * limit;

    return this.model.find().skip(startIndex).limit(limit).exec();
  }

  async findById(id: string): Promise<T> {
    const item = await this.model.findById(id).exec();
    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    return item;
  }

  async update(id: string, updateDto: Partial<T>): Promise<T> {
    const updatedItem = await this.model.findByIdAndUpdate(id, updateDto, { new: true }).exec();
    if (!updatedItem) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    return updatedItem;
  }

  async delete(id: string): Promise<T> {
    const deletedItem = await this.model.findByIdAndDelete(id).exec();
    if (!deletedItem) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    return deletedItem;
  }
}
