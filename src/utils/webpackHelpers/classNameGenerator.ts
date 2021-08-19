import path from 'path';
import normalizePath from 'normalize-path';
import unescape from './unescape';
import paths from '../../paths';
import {
  readFileSync,
  appendFile,
  createEmptyFile,
  writeFileSync,
  existsSync,
  ensureDirSync,
} from '../fsExtend';
import { toJson as convertMapToJson } from '../mapHelpers';
import { getBuildCacheDir } from '../getCacheDirectory';
import shortenKeyInDictClassName, {
  getShortName,
} from './shortenKeyInDictClassName';

type CleanupFn = () => any;

export const DICT_CACHE_PATH = getBuildCacheDir('classnames.dict');

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');
const NUMBER = '0123456789'.split('');

const PREFIX = [...ALPHABET, '_'];
const PREFIX_LIMIT = PREFIX.length - 1;

const SUFFIX = [...ALPHABET, ...NUMBER, '_'];
const SUFFIX_LIMIT = SUFFIX.length - 1;

const LIMIT = 9;
const SUFFIX_BEGIN_INDEX = -1;
const COUNT_BEGIN_INDEX = 0;
const CLASS_LIMIT_LENGTH = 3;

let prefixIndex = 0;
let suffixIndex = SUFFIX_BEGIN_INDEX;
let count = COUNT_BEGIN_INDEX;

let coll;

function updateDictPosition() {
  count++;
  if (count > LIMIT) {
    count = COUNT_BEGIN_INDEX;
    suffixIndex++;
  }
  if (suffixIndex > SUFFIX_LIMIT) {
    suffixIndex = SUFFIX_BEGIN_INDEX;
    prefixIndex++;
  }
  if (prefixIndex > PREFIX_LIMIT) {
    console.log({ suffixIndex, prefixIndex, count });
    throw new Error('Please refactor application, too many classnames!');
  }
}

function saveRecordToDictFile(id: string, classname: string) {
  setImmediate(appendFile, DICT_CACHE_PATH, id + ':' + classname + '|');
}

function getClassName(id: string): string {
  const name = coll.get(id);
  if (name) {
    return name;
  }

  if (id.length <= CLASS_LIMIT_LENGTH) {
    coll.set(id, id);
    return id;
  }

  const char = [PREFIX[prefixIndex], count];
  if (suffixIndex >= 0) {
    char.push(SUFFIX[suffixIndex]);
  }

  const replaceName = char.join('');

  coll.set(id, replaceName);
  updateDictPosition();
  saveRecordToDictFile(id, replaceName);

  return replaceName;
}

const getDictAssetPath = (prefixOfAssetPath?: string): string =>
  (prefixOfAssetPath || paths.clientBuildFolder) +
  '/static/dictOfClassName.json';

function createJsonDictInAsset(
  dict: Map<any, any>,
  predixOfAssetPath?: string,
) {
  const shouldBreak = !existsSync(paths.clientBuildFolder);
  if (shouldBreak) {
    return;
  }

  const assetPath = getDictAssetPath(predixOfAssetPath);
  ensureDirSync(path.dirname(assetPath));

  const jsonOfDict = convertMapToJson(dict, shortenKeyInDictClassName);
  return writeFileSync(assetPath, jsonOfDict);
}

export function initialOnWeb(forceUpdate: boolean = true): CleanupFn {
  const shouldEmptyFile = forceUpdate || !existsSync(DICT_CACHE_PATH);
  if (shouldEmptyFile) {
    createEmptyFile(DICT_CACHE_PATH);
  }

  coll = new Map();
  return (prefixOfAssetPath?: string) => {
    createJsonDictInAsset(coll, prefixOfAssetPath);
    setImmediate(() => {
      coll.clear();
    });
  };
}

export function initialOnNode(): CleanupFn {
  const dictContent = readFileSync(DICT_CACHE_PATH).toString();
  const dictMap: any[] = dictContent
    .split('|')
    .filter(Boolean)
    .map((row): string[] => row.split(':'));

  coll = new Map(dictMap);
  return () => {
    coll.clear();
  };
}

function classNameGenerator(
  loaderContext,
  localIdentName: string,
  localName: string,
  options,
): string {
  if (!(coll instanceof Map)) {
    throw new Error('Dict of classnames not prepare before, Please check it!');
  }

  if (!options.context) {
    options.context = loaderContext.rootContext;
  }

  const request = normalizePath(
    path.relative(options.context || '', loaderContext.resourcePath),
  );

  options.file = options.hashPrefix + request;
  options.object = unescape(localName);
  options.content = `${options.file}+${options.object}`;

  const id = options.content;
  const key = getShortName(id);
  const className = getClassName(key);
  return className;
}

export default classNameGenerator;
