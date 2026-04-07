import { Model, Document, FilterQuery } from 'mongoose';
import Logger from '../patterns/singleton/Logger';

export abstract class BaseRepository<T extends Document> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async findById(id: string): Promise<T | null> {
    try {
      return await this.model.findById(id).exec();
    } catch (error) {
      Logger.getInstance().error(`Error finding by ID: ${error}`);
      throw error;
    }
  }

  async findAll(filter?: Partial<T>): Promise<T[]> {
    try {
      return await this.model.find((filter as FilterQuery<T>) || {}).exec();
    } catch (error) {
      Logger.getInstance().error(`Error finding all: ${error}`);
      throw error;
    }
  }

  async create(data: Partial<T>): Promise<T> {
    try {
      const doc = new this.model(data);
      return await doc.save();
    } catch (error) {
      Logger.getInstance().error(`Error creating: ${error}`);
      throw error;
    }
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    try {
      return await this.model.findByIdAndUpdate(id, data, { new: true }).exec();
    } catch (error) {
      Logger.getInstance().error(`Error updating: ${error}`);
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.model.findByIdAndDelete(id).exec();
      return result !== null;
    } catch (error) {
      Logger.getInstance().error(`Error deleting: ${error}`);
      throw error;
    }
  }

  async count(filter?: Partial<T>): Promise<number> {
    try {
      return await this.model.countDocuments((filter as FilterQuery<T>) || {}).exec();
    } catch (error) {
      Logger.getInstance().error(`Error counting: ${error}`);
      throw error;
    }
  }
}
