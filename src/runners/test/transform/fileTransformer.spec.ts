describe('Exported functions', () => {
  test('Exported "process" function', () => {
    const { process } = require('./fileTransformer');
    expect(process).toBeInstanceOf(Function);
  });
});

describe('Sucess cases', () => {
  const SAMPLES = [];

  const { process: fileTransformer } = require('./fileTransformer');
  SAMPLES.forEach((path) => {
    test(`Pass ${JSON.stringify(path)} as path`, () => {
      expect(fileTransformer(null, path)).toMatchSnapshot();
    });
  });
});
