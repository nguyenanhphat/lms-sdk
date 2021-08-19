describe('Exported functions', () => {
  test('Exported default function', () => {
    const { default: CustomClassNameHandler } = require('./CustomClassNameHandler');
    expect(CustomClassNameHandler).toBeInstanceOf(Function);
  });
});
