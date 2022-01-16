import { REDIS_URL } from './env';
import { createClient } from 'redis';

export const getClient = async () => {
  const client = createClient({
    url: REDIS_URL,
  });

  client.on('ready', () => {
    console.log('Redis ready');
  });
  client.on('end', () => {
    console.log('Redis disconnected');
  });
  client.on('error', (e) => {
    console.log('Redis error: ', e);
    throw e;
  });

  try {
    await client.ping();
  } catch (e) {
    await client.connect();
  }

  return client;
};
