import { BabelConfigFactory, ModeType, TargetType } from '../const';

import { BROWSERLIST } from '../enums/packageJson';
import deepmerge from 'deepmerge';
import { getAppConfig } from './getAppConfig';
import getCacheIdentifier from 'react-dev-utils/getCacheIdentifier';
import getPackageJson from './getPackageJson';

const getBrowserPreset = (
  factoryConfig: BabelConfigFactory,
  options?: { includeTypescript: boolean },
) => {
  const pkgJson = getPackageJson();
  const browserslist = pkgJson && pkgJson.browserslist;

  return {
    presets: [
      [
        require.resolve('@babel/preset-env'),
        {
          useBuiltIns: 'entry',
          corejs: 3,
          loose: true,
          modules: 'auto',
          targets: {
            browsers: browserslist || BROWSERLIST,
          },
        },
      ],
    ],
    plugins: [
      require.resolve('@babel/plugin-transform-react-constant-elements'),
      require.resolve('@babel/plugin-syntax-dynamic-import'),
      require.resolve('@babel/plugin-transform-exponentiation-operator'),
    ],
  };
};

const getNodePreset = (
  factoryConfig: BabelConfigFactory,
  options?: { includeTypescript: boolean },
) => ({
  presets: [
    [
      require.resolve('@babel/preset-env'),
      {
        targets: {
          node: 'current',
        },
      },
    ],
  ],
  plugins: [
    require.resolve('babel-plugin-dynamic-import-node'),
    require.resolve('babel-plugin-remove-webpack'),
  ],
});

function babelConfigFactory(
  factoryConfig: BabelConfigFactory,
  options?: { includeTypescript: boolean },
) {
  const isProdMode = factoryConfig.mode === ModeType.production;
  const appConfigFactory = getAppConfig();
  const appConfig = appConfigFactory();
  const { importAlias } = appConfig;

  const importAliasPlugins = [];
  if (Array.isArray(importAlias)) {
    importAlias.forEach(({ ...aliasConfig }) => {
      const importAliasPlugin = [
        require.resolve('babel-plugin-import'),
        aliasConfig,
        aliasConfig.libraryName,
      ];
      importAliasPlugins.push(importAliasPlugin);
    });
  }

  return deepmerge(
    {
      babelrc: false,
      configFile: false,
      presets: [
        require.resolve('@babel/preset-react'),
        options &&
          options.includeTypescript && [
            require.resolve('@babel/preset-typescript'),
          ],
      ].filter(Boolean),
      plugins: [
        require.resolve('babel-plugin-transform-export-extensions'),
        [
          require.resolve('babel-plugin-transform-react-remove-prop-types'),
          {
            removeImport: true,
          },
        ],
        require.resolve('@babel/plugin-proposal-class-properties'),
        require.resolve('@babel/plugin-proposal-object-rest-spread'),
        [require.resolve('@babel/plugin-transform-runtime'), {}],
        require.resolve('babel-plugin-add-react-displayname'),
        ...importAliasPlugins,
      ],
      cacheIdentifier: getCacheIdentifier(
        factoryConfig.target + factoryConfig.mode,
        ['react-sdk', 'react-dev-utils', 'react-scripts'],
      ),
      cacheDirectory: true,
      cacheCompression: isProdMode,
      compact: isProdMode,
    },
    (factoryConfig.target === 'node'
      ? getNodePreset(factoryConfig, options)
      : getBrowserPreset(factoryConfig, options)) as any,
  );
}

export default babelConfigFactory;
