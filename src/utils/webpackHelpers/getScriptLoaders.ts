import * as webpack from 'webpack';
import _omit from 'lodash/omit';
import {
  ScriptLoaderConfig,
  ModuleExtensionsType,
  TargetType,
} from '../../const';
import getBabelModule from './getBabelModule';

export default function getScriptLoaders(
  target: TargetType,
  scriptLoaderConfig: ScriptLoaderConfig,
  extensions: {
    script: ModuleExtensionsType['script'];
    typescript: ModuleExtensionsType['typescript'];
  },
): webpack.RuleSetRule[] {
  const { script: esExts, typescript: tsExts } = extensions;

  const moduleLoaderForJavascript = {
    ...getBabelModule({
      ...scriptLoaderConfig,
      test: new RegExp(`(${esExts.join('|')})$`),
      includeTypescript: false,
    }),
    resolve: {
      mainFields:
        target === TargetType.node
          ? ['main', 'module']
          : ['browser', 'main', 'module'],
    },
  };

  const esModuleLoaderForJavascript = _omit(
    {
      ...moduleLoaderForJavascript,
      test: /\.mjs$/,
      resolve: {
        mainFields: ['main', 'module', 'browser'],
      },
    },
    ['include'],
  );

  global.console.log(
    'resolve',
    (target === TargetType.node
      ? ['main', 'module']
      : ['browser', 'main', 'module']
    ).join(','),
  );

  const moduleLoaderForTypescript = getBabelModule({
    ...scriptLoaderConfig,
    test: new RegExp(`(${tsExts.join('|')})$`),
    includeTypescript: true,
  });

  return [
    moduleLoaderForJavascript,
    esModuleLoaderForJavascript,
    moduleLoaderForTypescript,
  ];
}
