import os from 'os';
import path from 'path';
import { DefinedServiceWorkerInfo } from '../const';
import { appendFile } from './fsExtend';
import getEnvConfig from './getEnvConfig';

const TRY_CATCH_TEMPLATE = `try{:code}catch(e){}`;

const wrapCodeInSafeMode = (code: string): string =>
  TRY_CATCH_TEMPLATE.replace(':code', code);

export const appendImportScripts = (
  filePath: string,
  listOfScripts: string[],
  contentPrefix?: string,
): Promise<any> => {
  const { publicUrl } = getEnvConfig();

  const link = listOfScripts.map(scriptUrl => `"${publicUrl}${scriptUrl}"`);
  let code = wrapCodeInSafeMode(`importScripts(${link.join(', ')});`);
  if (contentPrefix) {
    code = contentPrefix + code;
  }

  return appendFile(filePath, code);
};

export const getDefinedInfoContent = (
  info: DefinedServiceWorkerInfo,
): string => {
  const keysOfInfo = Object.keys(info);
  const mappedInfo = keysOfInfo.map(key => `self.${key} = ${info[key]};`);
  const content = mappedInfo.join('');
  return content;
};

export const appendSourceMap = (filePath: string) => {
  const filename = path.basename(filePath) + '.map';
  return appendFile(filePath, `//# sourceMappingURL=${filename}`);
};
