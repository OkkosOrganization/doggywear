import { REDIS_URL } from "./env";
import {createClient} from 'redis';

export const client = createClient ({
  url : REDIS_URL,
});

client.on("error", function(err) {
  throw err;
});