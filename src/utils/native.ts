export const hasOwn = (data: object, key: string): boolean =>
  Object.hasOwnProperty.call(data, key);
