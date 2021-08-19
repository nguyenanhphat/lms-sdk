describe('Exported functions', () => {
  test('Exported "process" function', () => {
    const { process } = require('./base64Transformer');
    expect(process).toBeInstanceOf(Function);
  });
});

describe('Transform', () => {
  const SAMPLES = [];

  const { process: base64Transformer } = require('./base64Transformer');
  SAMPLES.forEach((path) => {
    expect(base64Transformer(null, path)).toMatchSnapshot();
  });
});
