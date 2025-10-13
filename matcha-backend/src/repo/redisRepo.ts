import { createClient } from 'redis';
import ConstMatcha from '../ConstMatcha.js';
import { clogger } from '../service/loggerSvc.js';

const redisClient = createClient({ 
  url: process.env.REDIS_HOST || ConstMatcha.REDIS_DEFAULT_HOST
});

redisClient.on('error', (err) => {
  clogger.error(`[redis]: Redis Client Error: ${err}`);
});

export default redisClient;