import _get from 'lodash/get';
import _merge from 'lodash/merge';
import _pick from 'lodash/pick';
import { PlatformType, TargetType } from '../../const';
import { CONFIG_KEYS } from '../../enums/jestConfig';
import { CommandArgs } from '../../interfaces/args.interface';
import {
  CoverageDirectoryEnum,
  JestConfig,
} from '../../interfaces/jestConfig.interface';
import paths from '../../paths';
import bindPlatformToExtensions from '../../utils/bindPlatformToExtensions';
import { getAppConfig } from '../../utils/getAppConfig';
import getPackageJson from '../../utils/getPackageJson';
import getModuleNameMapper from './getModuleNameMapper';

const ENUMS = {
  jsExtensions: ['js', 'jsx'],
  tsExtensions: ['ts', 'tsx'],
  cssExtensions: ['scss', 'css'],
  fileExtensions: ['js', 'jsx', 'ts', 'tsx', 'css', 'scss', 'json', 'node'],
};

const getJestConfig = (params: CommandArgs): JestConfig => {
  const { platform, target } = params;

  const pkgJson = getPackageJson();

  const coverageExtensions = [...ENUMS.jsExtensions, ...ENUMS.tsExtensions];
  const coverageFileMatcher = !platform
    ? `**/*.(${coverageExtensions.join('|')})` // TODO: should have a default to have correct coverage?
    : `**/!(*.${
        platform === PlatformType.wap ? 'web' : 'wap'
      }).(${coverageExtensions.join('|')})`;

  const configFactory = getAppConfig();
  const appConfig = configFactory();
  const jestConfigExtend = _get(appConfig, 'jestConfig');

  const { useDefaultSnapshotResolver = false } = jestConfigExtend || {};
  const isUseDefaultSnapshotResolver = !!useDefaultSnapshotResolver;

  const extendConfig = _pick(jestConfigExtend, CONFIG_KEYS);
  const moduleNameMapper = getModuleNameMapper();
  const displayName = platform && {
    name: platform.toString().toUpperCase(),
    color: 'blue',
  };

  const jestConfig = _merge(
    {
      displayName,

      verbose: true,

      roots: ['<rootDir>'],
      rootDir: paths.appPath,

      coverageDirectory: `<rootDir>/coverage/${platform}`,
      collectCoverageFrom: [coverageFileMatcher],
      coveragePathIgnorePatterns: [
        '/node_modules/',
        '/build/',
        '/dist/',
        '/coverage/',
      ],

      coverageReporters: [
        CoverageDirectoryEnum['json-summary'],
        CoverageDirectoryEnum.text,
      ],

      reporters: ['default'],

      globals: {
        // everyone can modify by environment worker
        __CLIENT__: target === TargetType.web,
        __SERVER__: target === TargetType.node,
        __MAJOR_VERSION__: pkgJson.version,
        __WEB__: platform === PlatformType.web,
        __WAP__: platform === PlatformType.wap,
        __COMMIT_HASH__: '__COMMIT_HASH__',
        __BRANCH__: '__BRANCH__',
        __BUILD_TIME__: '__BUILD_TIME__',
        __PROD__: true,
      },

      testRunner: require.resolve('./runner'),

      testMatch: platform
        ? [
            `**/!(*.${
              platform === PlatformType.wap ? 'web' : 'wap'
            })+(spec|test).(${ENUMS.jsExtensions.join('|')})`,
          ]
        : [`**/?(*.)+(spec|test).(${ENUMS.jsExtensions.join('|')})`],

      testPathIgnorePatterns: ['/node_modules/', '/(dist|build)/'],

      testEnvironment: require.resolve('./environment/browser'),

      testURL: process.env.APP_BASE_DOMAIN || 'http://localhost',

      setupFilesAfterEnv: [
        require.resolve('react-app-polyfill/jsdom'),
        require.resolve('./configLibraries'),
      ],

      transform: {
        [`^.+\\.(${[
          ...ENUMS.jsExtensions,
          ...bindPlatformToExtensions(platform, ENUMS.jsExtensions, false),
        ].join('|')})$`]: require.resolve('./transform/babelTransformer'),
        [`^.+\\.(${[
          ...ENUMS.tsExtensions,
          ...bindPlatformToExtensions(platform, ENUMS.tsExtensions, false),
        ].join('|')})$`]: require.resolve('./transform/typescriptTransformer'),
        [`^.+\\.(${[
          ...ENUMS.cssExtensions,
          ...bindPlatformToExtensions(platform, ENUMS.cssExtensions, false),
        ].join('|')})$`]: require.resolve('./transform/cssTransformer'),
        '^.+\\.(bmp|gif|jpe?g|png)$': require.resolve(
          './transform/fileTransformer',
        ),
        '^.+\\.icon.svg$': require.resolve(
          './transform/svgComponentTransformer',
        ),
        '^.+\\.base64.svg$': require.resolve('./transform/base64Transformer'),
        '^.+\\.svg$': require.resolve('./transform/base64Transformer'),
      },

      moduleFileExtensions: [
        ...ENUMS.fileExtensions,
        ...bindPlatformToExtensions(platform, ENUMS.fileExtensions, false),
      ],

      // TODO: rework
      transformIgnorePatterns: ['/@nghiepuit/react-sdk/', '/react-sdk/'],
      watchPlugins: [
        require.resolve('jest-watch-typeahead/filename'),
        require.resolve('jest-watch-typeahead/testname'),
        require.resolve('./watchSetupTestBuilder'),
      ],

      haste: {
        defaultPlatform: platform,
        platforms: [PlatformType.wap, PlatformType.web],
      },

      snapshotResolver:
        !isUseDefaultSnapshotResolver &&
        require.resolve('./customSnapshotResolver'),
    },
    extendConfig,
    {
      moduleNameMapper,
    },
  );

  return jestConfig;
};

export default getJestConfig;
