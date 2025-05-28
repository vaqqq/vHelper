import { LRUCache } from "lru-cache";

export const cache = new LRUCache<string, number | object>({
  max: 100,
  ttl: 15 * 60 * 1000,
});

