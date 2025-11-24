import { DataSource } from 'typeorm';
import ormconfig from './ormconfig';

/**
 * DataSource for TypeORM CLI
 * Used for running migrations
 */
export const AppDataSource = new DataSource(ormconfig);
