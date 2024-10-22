import dotenv from 'dotenv';

dotenv.config();

export const SERVER_PORT = process.env.SERVER_PORT
  ? Number(process.env.SERVER_PORT)
  : 3000;

export const DB_USERNAME = process.env.DB_USERNAME || '';
export const DB_PASSWORD = process.env.DB_PASSWORD || '';
export const DATABASE = process.env.DATABASE || '';

export const MONGODB = {
  DB_USERNAME,
  DB_PASSWORD,
  DATABASE,
};
