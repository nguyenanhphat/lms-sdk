function createExportedTestCase(path: string, name: string, alias: string) {
  const caseName = `Exported \`${name}\` function`;
  test(caseName, () => {
    const exportedFn = require(path)[alias];
    expect(exportedFn).toBeInstanceOf(Function);
  });
}

const EXPORTED_FUNCTIONS = [
  ['dotenvExtend', './utils/dotenvExtend', 'default'],
  ['applyConfigToPaths', './utils/applyConfigToPaths', 'default'],
  ['getTasksList', './utils/getTasksList', 'default'],
  ['findTask', './utils/getTasksList', 'findTask'],
  ['setNodeEnv', './utils/setNodeEnv', 'default'],
  ['getModuleConfig', './utils/webpackHelpers/getModuleConfig', 'default'],
  ['getResolveConfig', './utils/webpackHelpers/getResolveConfig', 'default'],
  ['getModuleExtensions', './utils/getModuleExtensions', 'default'],
  ['webpackConfigFactory', './utils/webpackConfigFactory', 'webpackConfigFactory'],
  ['runWebpackDevServer', './runners/runWebpackDevServer', 'runWebpackDevServer'],
  ['runWebpackBuildWatchMode', './runners/runWebpackBuildWatchMode', 'runWebpackBuildWatchMode'],
  ['runWebpackBuild', './runners/runWebpackBuild', 'runWebpackBuild'],
  ['buildFullProcess', './runners/runWebpackBuild', 'buildFullProcess'],
];

describe('Exported functions', () => {
  test.each(EXPORTED_FUNCTIONS)('Exported %j function', (name, path, alias) => {
    const exportedFn = require(path)[alias];
    expect(exportedFn).toBeInstanceOf(Function);
  });
});
