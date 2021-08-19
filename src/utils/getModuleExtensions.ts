import bindPlatformToExtensions from './bindPlatformToExtensions';

import {
  JSON_FILE_EXTENSIONS,
  SCRIPTS_FILE_EXTENSIONS,
  TYPESCRIPT_FILE_EXTENSIONS,
  STYLE_FILE_EXTENSIONS,
  PlatformType,
  ModuleExtensionsType,
} from '../const';

export const getModuleExtensions = (
  platform: PlatformType | null,
): ModuleExtensionsType => {
  const scriptExtensions = [
    ...SCRIPTS_FILE_EXTENSIONS.map(t => `.${t}`),
    ...bindPlatformToExtensions(platform, SCRIPTS_FILE_EXTENSIONS),
  ];
  const typescriptExtensions = [
    ...TYPESCRIPT_FILE_EXTENSIONS.map(t => `.${t}`),
    ...bindPlatformToExtensions(platform, SCRIPTS_FILE_EXTENSIONS),
  ];

  const stylesExtensions = [
    ...STYLE_FILE_EXTENSIONS.map(t => `.${t}`),
    ...bindPlatformToExtensions(platform, STYLE_FILE_EXTENSIONS),
  ];

  const jsonExtensions = [
    ...JSON_FILE_EXTENSIONS.map(t => `.${t}`),
    ...bindPlatformToExtensions(platform, JSON_FILE_EXTENSIONS),
  ];

  const moduleExtensions = [
    ...scriptExtensions,
    ...typescriptExtensions,
    ...stylesExtensions,
    ...jsonExtensions,
  ];

  return {
    script: scriptExtensions,
    typescript: typescriptExtensions,
    styles: stylesExtensions,
    json: jsonExtensions,
    module: moduleExtensions,
  };
};

export default getModuleExtensions;
