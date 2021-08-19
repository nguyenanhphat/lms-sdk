describe('Exported functions', () => {
  test('Exported default function', () => {
    const { default: SourceMapHandler } = require('./SourceMapHandler');
    expect(SourceMapHandler).toBeInstanceOf(Function);
  });
});

describe('Initial', () => {
  test('With default config', () => {
    const { default: SourceMapHandler } = require('./SourceMapHandler');

    const sourceMapHandler = new SourceMapHandler();

    expect(sourceMapHandler.name).toEqual('SourceMapHandler');
    expect(sourceMapHandler.assetNameRegExp).toBeInstanceOf(RegExp);
  });

  test('With custom config', () => {
    const { default: SourceMapHandler } = require('./SourceMapHandler');

    const assetNameRegExp = new RegExp('_');
    const sourceMapHandler = new SourceMapHandler({ assetNameRegExp });

    expect(sourceMapHandler.name).toEqual('SourceMapHandler');
    expect(sourceMapHandler.assetNameRegExp).toEqual(assetNameRegExp);
  });
});

describe('Workflow', () => {
  test('Should break if devtool is not "source-map"', () => {
    const { default: SourceMapHandler } = require('./SourceMapHandler');

    const sourceMapHandler = new SourceMapHandler();
    expect(sourceMapHandler.apply({ options: { devtool: 'none' } })).toBeUndefined();
  });
});
