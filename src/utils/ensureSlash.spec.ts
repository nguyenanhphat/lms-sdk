describe('Exported functions', () => {
  test('Exported default function', () => {
    const { default: ensureSlash } = require('./ensureSlash');
    expect(ensureSlash).toBeInstanceOf(Function);
  });

  test('Exported "ensureSlash" function', () => {
    const { ensureSlash } = require('./ensureSlash');
    expect(ensureSlash).toBeInstanceOf(Function);
  });
});

describe('Ensure having slash', () => {
  const SAMPLES = [
    ['#/', '#/'],
    ['/', '/'],
    ['//', '//'],
    ['', '/'],
  ];

  const { default: ensureSlash } = require('./ensureSlash');
  test.each(SAMPLES)(
    'Pass %j should be return %j',
    (path: string, expected: string) => {
      expect(ensureSlash(path, true)).toEqual(expected);
    },
  );
});

describe('Ensure NOT having slash', () => {
  const SAMPLES = [
    ['#', '#'],
    ['/', ''],
    ['//', '/'],
    ['', ''],
  ];

  const { default: ensureSlash } = require('./ensureSlash');
  test.each(SAMPLES)(
    'Pass %j should be return %j',
    (path: string, expected: string) => {
      expect(ensureSlash(path, false)).toEqual(expected);
    },
  );
});

describe('Failed cases', () => {
  const SAMPLES = [null, undefined, {}, new Map(), new Set()];

  const { default: ensureSlash } = require('./ensureSlash');
  test.each(SAMPLES)('Pass %j should throw error', (path: any) => {
    function run() {
      ensureSlash(path, true);
    }
    expect(run).toThrowErrorMatchingSnapshot();
  });
});
