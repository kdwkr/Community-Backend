import redis from 'redis';

import CONF from './config';

export const redisClient = redis.createClient(CONF.redis);

export function set(key: string, value: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    redisClient.set(key, value, (err, reply) => {
      if (err) {
        resolve(false);
      } else {
        redisClient.expire(key, CONF.refreshTokenExpire);
        resolve(true);
      }
    });
  });
}

export function get(key: string): Promise<string | null> {
  return new Promise((resolve, reject) => {
    redisClient.get(key, (err, reply) => {
      if (err) {
        resolve(null);
      } else {
        resolve(reply);
      }
    });
  });
}

export function scan(
  cursor: string,
  pattern: string,
  count = '1000',
): Promise<[string, string[]]> {
  return new Promise((resolve, reject) => {
    redisClient.scan(cursor, 'MATCH', pattern, 'COUNT', count, (err, reply) => {
      resolve(reply);
    });
  });
}

export async function scanOne(pattern: string): Promise<string | null> {
  let cursor = '0';
  for (let i = 0; i < 1000; i++) {
    const t = await scan(cursor, pattern, '100');
    if (t[1][0]) return t[1][0];
    if ((cursor = t[0]) === '0') break;
  }
  return null;
}

export async function scanAll(pattern: string): Promise<string[]> {
  let cursor = '0';
  let result: string[] = [];
  for (let i = 0; i < 1000; i++) {
    // 혹시 모를 무한 루프 방지하기 위해 제한
    const t = await scan(cursor, pattern);
    result = [...result, ...t[1]];
    if ((cursor = t[0]) === '0') break;
  }
  return result;
}

export function deleteKey(key: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    redisClient.del(key, (err, reply) => {
      if (err || !reply) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

export function flushall(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    redisClient.flushall((err, reply) => {
      if (err) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

export default redisClient;
