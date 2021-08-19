describe('Exported functions', () => {
  test('Exported default function', () => {
    const { default: getEnvConfig } = require('./getEnvConfig');
    expect(getEnvConfig).toBeInstanceOf(Function);
  });
});

describe('Having required fields', () => {
  const { default: getEnvConfig } = require('./getEnvConfig');
  const requiredFields = [
    'nodeEnv',
    'publicUrl',
    'buildToolMaxEntryPointSize',
    'buildToolMaxAssetSize',
    'buildToolEnableDebugJs',
    'buildToolShowWarning',
    'buildToolEnableLintCheck',
    'buildToolEnableSourceMap',
    'buildToolCssModuleLocalIdent',
    'buildToolEnableDebugCss',
    'buildToolEnableCache',
    'buildToolCacheDirectory',
    'buildToolCacheTimeout',
    'buildToolCacheSizeThreshold',
    'buildToolEnableParallelCompile',
    'buildToolWorkerParallelJobs',
    'buildToolWorkerPoolTimeout',
    'buildToolModuleIdHashFunc',
    'buildToolModuleIdHashDigest',
    'buildToolModuleIdHashDigestLen',
    'buildToolEnableBundleAnalyzer',
    'buildToolEnableDetectDuplicatePackage',
    'buildToolEnablePrepackBrowser',
    'buildToolEnablePrepackNode',
    'buildToolEnablePrepackSW',
    'enableServiceWorker',
    'buildTime',
  ];
  const envConfig = getEnvConfig();

  test.each(requiredFields)('Having %j in environment config', (requiredField: string) => {
    expect(requiredField in envConfig).toEqual(true);
  });
});
