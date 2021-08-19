describe('Exported functions', () => {
  test('Exported default function', () => {
    const { default: cacheIdOfApp } = require('./cacheIdOfApp');
    expect(cacheIdOfApp).toBeInstanceOf(Function);
  });
});

describe('Workflow', () => {
  test('Cache id is valid', () => {
    const { default: cacheIdOfApp } = require('./cacheIdOfApp');
    const cacheId = cacheIdOfApp();
    expect(typeof cacheId).toEqual('string');
    expect(cacheId.length).toEqual(8);
  });
});
