import { ensureSlash } from './ensureSlash';
import memoizeFn from './memoizeFn';
import { EnvConfig } from '../const';
import { parse as parseJson } from './jsonHelpers';

export default memoizeFn(
  (): EnvConfig => {
    const {
      NODE_ENV,
      PUBLIC_URL,
      BUILD_TOOL_MAX_ENTRY_POINT_SIZE,
      BUILD_TOOL_MAX_ASSET_SIZE,
      BUILD_TOOL_ENABLE_DEBUG_JS,
      BUILD_TOOL_SHOW_WARNING,
      BUILD_TOOL_ENABLE_LINT_CHECK,
      BUILD_TOOL_ENABLE_JS_SOURCE_MAP,
      BUILD_TOOL_CSS_MODULE_LOCAL_IDENT,
      BUILD_TOOL_ENABLE_DEBUG_CSS,
      BUILD_TOOL_ENABLE_CACHE,
      BUILD_TOOL_CACHE_DIRECTORY,
      BUILD_TOOL_CACHE_TIMEOUT,
      BUILD_TOOL_CACHE_SIZE_THRESHOLD,
      BUILD_TOOL_ENABLE_PARALLEL_COMPILE,
      BUILD_TOOL_WORKER_PARALLEL_JOBS,
      BUILD_TOOL_WORKER_POOL_TIMEOUT,
      BUILD_TOOL_MODULE_ID_HASH_FUNC,
      BUILD_TOOL_MODULE_ID_HASH_DIGEST,
      BUILD_TOOL_MODULE_ID_HASH_DIGEST_LEN,
      BUILD_TOOL_ENABLE_BUNDLE_ANALYZER,
      BUILD_TOOL_ENABLE_DETECT_DUPLICATE_PACKAGE,
      BUILD_TOOL_ENABLE_PREPACK_BROWSER,
      BUILD_TOOL_ENABLE_PREPACK_NODE,
      BUILD_TOOL_ENABLE_PREPACK_SW,
      APP_ENABLE_SERVICE_WORKER,
    } = process.env;

    const shouldUseDefault =
      ['default', 'off', 'auto_increment'].includes(
        (BUILD_TOOL_CSS_MODULE_LOCAL_IDENT || '').toLowerCase(),
      ) || !BUILD_TOOL_CSS_MODULE_LOCAL_IDENT;
    const cssLocalIdent = !shouldUseDefault
      ? BUILD_TOOL_CSS_MODULE_LOCAL_IDENT
      : false;

    return {
      nodeEnv: NODE_ENV,
      publicUrl: !PUBLIC_URL ? '' : ensureSlash(PUBLIC_URL, false),
      buildToolMaxEntryPointSize:
        parseInt(BUILD_TOOL_MAX_ENTRY_POINT_SIZE, 10) || 716800,
      buildToolMaxAssetSize: parseInt(BUILD_TOOL_MAX_ASSET_SIZE, 10) || 1536000,
      buildToolEnableDebugJs: BUILD_TOOL_ENABLE_DEBUG_JS === '1',
      buildToolShowWarning: BUILD_TOOL_SHOW_WARNING === '1',
      buildToolEnableLintCheck: BUILD_TOOL_ENABLE_LINT_CHECK === '1',
      buildToolEnableSourceMap: BUILD_TOOL_ENABLE_JS_SOURCE_MAP === '1',
      buildToolCssModuleLocalIdent: cssLocalIdent,
      buildToolEnableDebugCss: BUILD_TOOL_ENABLE_DEBUG_CSS === '1',
      buildToolEnableCache: BUILD_TOOL_ENABLE_CACHE === '1',
      buildToolCacheDirectory: BUILD_TOOL_CACHE_DIRECTORY || 'default',
      buildToolCacheTimeout:
        parseInt(BUILD_TOOL_CACHE_TIMEOUT, 10) || 604800000,
      buildToolCacheSizeThreshold:
        parseInt(BUILD_TOOL_CACHE_SIZE_THRESHOLD, 10) || 209715200,
      buildToolEnableParallelCompile:
        BUILD_TOOL_ENABLE_PARALLEL_COMPILE === '1',
      buildToolWorkerParallelJobs:
        parseInt(BUILD_TOOL_WORKER_PARALLEL_JOBS, 10) || 50,
      buildToolWorkerPoolTimeout:
        parseInt(BUILD_TOOL_WORKER_POOL_TIMEOUT, 10) || 2000,
      buildToolModuleIdHashFunc: BUILD_TOOL_MODULE_ID_HASH_FUNC || 'sha256',
      buildToolModuleIdHashDigest: BUILD_TOOL_MODULE_ID_HASH_DIGEST || 'hex',
      buildToolModuleIdHashDigestLen:
        parseInt(BUILD_TOOL_MODULE_ID_HASH_DIGEST_LEN, 10) || 20,
      buildToolEnableBundleAnalyzer: BUILD_TOOL_ENABLE_BUNDLE_ANALYZER === '1',
      buildToolEnableDetectDuplicatePackage:
        BUILD_TOOL_ENABLE_DETECT_DUPLICATE_PACKAGE === '1',
      buildToolEnablePrepackBrowser: BUILD_TOOL_ENABLE_PREPACK_BROWSER === '1',
      buildToolEnablePrepackNode: BUILD_TOOL_ENABLE_PREPACK_NODE === '1',
      buildToolEnablePrepackSW: BUILD_TOOL_ENABLE_PREPACK_SW === '1',
      enableServiceWorker: !!parseJson(APP_ENABLE_SERVICE_WORKER || 'false'),
      buildTime: parseInt(process.env.BUILD_TIME, 10),
    };
  },
);
