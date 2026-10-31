import type { QueryFilter, UpdateQuery } from "mongoose";

export interface IBaseRepository<T> {
  create(data: Partial<T>): Promise<T>;
  findById(id: string): Promise<T | null>;
  findOne(filter: QueryFilter<T>): Promise<T | null>;
  findAll(filter?: QueryFilter<T>): Promise<T[]>;
  updateOne(filter: QueryFilter<T>, data: UpdateQuery<T>): Promise<T | null>;
  deleteOne(filter: QueryFilter<T>): Promise<T | null>;
  count(filter?: QueryFilter<T>): Promise<number>;
}