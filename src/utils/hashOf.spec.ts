describe('Exported functions', () => {
  test('Exported default function', () => {
    const { default: hashOf } = require('./hashOf');
    expect(hashOf).toBeInstanceOf(Function);
  });
});

describe('Hash results', () => {
  const SAMPLES = [
    [() => {}, 8], // tslint:disable-line:no-empty
    [() => {}, 40], // tslint:disable-line:no-empty
    ['_string_', 8],
    ['_string_', 40],
    [123, 8],
    [123, 40],
    [null, 8],
    [null, 40],
    [undefined, 8],
    [undefined, 40],
    [new Map([['k1', 'v1']]), 8],
    [new Map([['k1', 'v1']]), 40],
    [new Set(['k1', 'k2']), 8],
    [new Set(['k1', 'k2']), 40],
    [{}, 8],
    [{}, 8],
    [{ k1: 'v1', k2: 123, k3: undefined, k4: null, k5() {} }, 40], // tslint:disable-line:no-empty
    [{ k1: 'v1', k2: 123, k3: undefined, k4: null, k5() {} }, 40], // tslint:disable-line:no-empty
    [['v1', 123, undefined, null, function xx() {}], 8], // tslint:disable-line:no-empty
    [['v1', 123, undefined, null, function xx() {}], 40], // tslint:disable-line:no-empty
  ];

  const { default: hashOf } = require('./hashOf');
  test.each(SAMPLES)('%# data is %j and length is %d', (data: any, length: number) => {
    expect(hashOf(data, length)).toMatchSnapshot();
  });
});
