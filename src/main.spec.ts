jest.mock('react-dev-utils/clearConsole', () => {
  return jest.fn(() => false);
});

describe('Exported functions', () => {
  test('Exported default function', () => {
    const { default: main } = require('./main');
    expect(main).toBeInstanceOf(Function);
  });
});

describe('Try to run main', () => {
  test('Run "checkAndClearCache" function', async () => {
    const checkAndClearCache = require('./utils/checkAndClearCache');
    const spy = jest.spyOn(checkAndClearCache, 'default');

    const { default: main } = require('./main');
    const result = await main({
      argv: {
        clearCache: true,
      },
    });

    expect(result).toEqual(true);
    expect(spy).toHaveBeenCalled();

    spy.mockRestore();
  });

  test('Run "checkAndPrintInfo" function', async () => {
    const checkAndPrintInfo = require('./utils/checkAndPrintInfo');
    const spy = jest.spyOn(checkAndPrintInfo, 'default');

    const { default: main } = require('./main');
    const result = await main({
      argv: {
        info: true,
      },
    });

    expect(result).toEqual(true);
    expect(spy).toHaveBeenCalled();

    spy.mockRestore();
  });
});
