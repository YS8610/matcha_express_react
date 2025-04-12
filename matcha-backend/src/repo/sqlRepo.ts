import dotenv from "dotenv";
import { Pool } from 'pg';

dotenv.config();

const POSTGRES_HOST = process.env.POSTGRES_HOST || 'localhost';
const POSTGRES_DB = process.env.POSTGRES_DB || '';
const POSTGRES_USER = process.env.POSTGRES_USER || '';
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || '';
const POSTGRES_PORT = process.env.POSTGRES_PORT || '5432';

const Client = new Pool({
  host: POSTGRES_HOST,
  database: POSTGRES_DB,
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  port: parseInt(POSTGRES_PORT)||5432 ,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

export default Client;