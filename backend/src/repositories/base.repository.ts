import type { Document, Model, QueryFilter, UpdateQuery } from "mongoose";
import { IBaseRepository } from "./interfaces/IBaseRepository";

export abstract class BaseRepository<T extends Document>
  implements IBaseRepository<T>
{
  constructor(protected readonly model: Model<T>) {}

  async create(data: Partial<T>): Promise<T> {
    const doc = await this.model.create(data);
    return doc as unknown as T;
  }

  async findById(id: string): Promise<T | null> {
    return await this.model.findById(id);
  }

  async findOne(filter: QueryFilter<T>): Promise<T | null> {
    return await this.model.findOne(filter);
  }

  async findAll(filter: QueryFilter<T> = {}): Promise<T[]> {
    return await this.model.find(filter);
  }

  async updateOne(filter: QueryFilter<T>, data: UpdateQuery<T>): Promise<T | null> {
    return await this.model.findOneAndUpdate(filter, data, {
      new: true,
      runValidators: true,
    });
  }

  async deleteOne(filter: QueryFilter<T>): Promise<T | null> {
    return await this.model.findOneAndDelete(filter);
  }

  async count(filter: QueryFilter<T> = {}): Promise<number> {
    return await this.model.countDocuments(filter);
  }
}