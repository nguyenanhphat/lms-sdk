describe('Exported functions', () => {
  test('Exported "getSassModuleNameMapper" function', () => {
    const { getSassModuleNameMapper } = require('./getModuleNameMapper');
    expect(getSassModuleNameMapper).toBeInstanceOf(Function);
  });
  test('Exported "getModuleNameMapper" function', () => {
    const { default: getModuleNameMapper } = require('./getModuleNameMapper');
    expect(getModuleNameMapper).toBeInstanceOf(Function);
  });
});

// describe('Result from "getSassModuleNameMapper" function', () => {
//   test('With default config', () => {
//     const { getSassModuleNameMapper } = require('./getModuleNameMapper');
//     expect(getSassModuleNameMapper()).toMatchSnapshot();
//   });
// });

// describe('Result from "getModuleNameMapper" function', () => {
//   test('With default config', () => {
//     const { default: getModuleNameMapper } = require('./getModuleNameMapper');
//     expect(getModuleNameMapper()).toMatchSnapshot();
//   });
// });
