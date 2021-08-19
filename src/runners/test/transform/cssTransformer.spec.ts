describe('Exported functions', () => {
  test('Exported "process" function', () => {
    const { process } = require('./cssTransformer');
    expect(process).toBeInstanceOf(Function);
  });
});
