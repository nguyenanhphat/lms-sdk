describe('Exported functions', () => {
  test('Exported default function', () => {
    const { default: paths } = require('./paths');
    expect(paths).not.toBeNull();
  });
});

describe('Having required fields', () => {
  const { default: paths } = require('./paths');
  const requiredFields = [
    'toolPath',
    'toolPackageJson',
    'resolveInToolPath',
    'resolveInToolCache',
    'resolveInAppPath',
    'resolveInWorkspaceFolder',
    'appPath',
    'appSrc',
    'appPackageJson',
    'appPublic',
    'appBinary',
    'proxySetup',
  ];

  test.each(requiredFields)('Having %j in paths', (requiredField: string) => {
    expect(requiredField in paths).toEqual(true);
  });
});
