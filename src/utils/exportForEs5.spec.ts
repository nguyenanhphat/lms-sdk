describe('Exported functions', () => {
  test('Exported default function', () => {
    const { default: exportForEs5 } = require('./exportForEs5');
    expect(exportForEs5).toBeInstanceOf(Function);
  });
});

describe('Transform is code', () => {
  const SAMPLES = [
    [undefined, undefined],
    [null, null],
    ['empty', ''],
    ['function', () => {}], // tslint:disable-line:no-empty
    ['string', '__string__'],
    ['number', 123],
    ['object', { key: 'value' }],
    ['map', new Map([['key', 'value']])],
    ['set', new Set(['key1', 'key2'])],
  ];

  const { default: exportForEs5 } = require('./exportForEs5');
  test.each(SAMPLES)('Type is %j', (type: string, code: any) => {
    expect(exportForEs5(code)).toMatchSnapshot();
  });
});
