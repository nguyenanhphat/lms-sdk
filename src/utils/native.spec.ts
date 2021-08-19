describe('"hasOwn" util', () => {
  const { hasOwn } = require('./native');
  const data = { key1: '' };

  test('Exported "hasOwn" function', () => {
    expect(hasOwn).toBeInstanceOf(Function);
  });

  test('Check if key is exsited', () => {
    expect(hasOwn(data, 'key1')).toEqual(true);
  });

  test('Check if key is NOT exsited', () => {
    expect(hasOwn(data, 'key2')).toEqual(false);
  });
});
