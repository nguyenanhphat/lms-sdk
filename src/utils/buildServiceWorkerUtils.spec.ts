describe('Exported functions', () => {
  test('Exported "appendImportScripts" function', () => {
    const { appendImportScripts } = require('./buildServiceWorkerUtils');
    expect(appendImportScripts).toBeInstanceOf(Function);
  });
  test('Exported "getDefinedInfoContent" function', () => {
    const { getDefinedInfoContent } = require('./buildServiceWorkerUtils');
    expect(getDefinedInfoContent).toBeInstanceOf(Function);
  });
  test('Exported "appendSourceMap" function', () => {
    const { appendSourceMap } = require('./buildServiceWorkerUtils');
    expect(appendSourceMap).toBeInstanceOf(Function);
  });
});

describe('Transform defined to code', () => {
  test('Success cases', () => {
    const { getDefinedInfoContent } = require('./buildServiceWorkerUtils');
    const codeTransformed = getDefinedInfoContent({
      version: '"__version__"',
      platform: '"__platform__"',
    });
    expect(codeTransformed).toMatchSnapshot();
  });

  describe('Failed cases', () => {
    const SAMPLES = [1, null, undefined, new Map(), new Set(), () => {}];

    const { default: ensureSlash } = require('./ensureSlash');
    test.each(SAMPLES)('Pass %j should throw error', (path: any) => {
      function run() {
        ensureSlash(path, true);
      }
      expect(run).toThrowErrorMatchingSnapshot();
    });
  });
});
