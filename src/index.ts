import dotenvExtend from './utils/dotenvExtend';
dotenvExtend();

import applyConfigToPaths from './utils/applyConfigToPaths';
applyConfigToPaths();

export { default as getTasksList, findTask } from './utils/getTasksList';
export { default as setNodeEnv } from './utils/setNodeEnv';
export { default as getModuleConfig } from './utils/webpackHelpers/getModuleConfig';
export { default as getResolveConfig } from './utils/webpackHelpers/getResolveConfig';
export { default as getModuleExtensions } from './utils/getModuleExtensions';
export { webpackConfigFactory } from './utils/webpackConfigFactory';
export { runWebpackDevServer } from './runners/runWebpackDevServer';
export { runWebpackBuildWatchMode } from './runners/runWebpackBuildWatchMode';
export { runWebpackBuild, buildFullProcess  } from './runners/runWebpackBuild';
