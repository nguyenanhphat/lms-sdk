import { MemoizeWrapped, MemoizeFn } from '../const';
import hashOf from './hashOf';

export default function memoizeFn<T extends MemoizeFn>(
  fn: T,
): T & MemoizeWrapped {
  const wrapped = (...rest: any[]) => {
    const key = hashOf(rest || {}, 8);
    if (wrapped.__cached.has(key)) {
      return wrapped.__cached.get(key);
    }

    const result = fn(...rest);
    wrapped.__cached.set(key, result);
    return result;
  };

  wrapped.__cached = new Map();
  wrapped.flush = () => wrapped.__cached.clear();

  return wrapped as any;
}
