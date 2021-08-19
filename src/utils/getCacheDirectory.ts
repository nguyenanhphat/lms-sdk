import path from 'path';
import _uniq from 'lodash/uniq';
import paths from '../paths';
import { ensureDirSync } from './fsExtend';

export const getBuildCacheDir = (...rest: string[]): string => {
  const resolvedPath = paths.resolveInToolCache(
    ['build', ...rest].filter(Boolean).join('/'),
  );

  const parentsDir = _uniq([
    paths.resolveInToolCache('build'),
    path.dirname(resolvedPath),
  ]);
  for (const parentDir of parentsDir) {
    ensureDirSync(parentDir);
  }

  return resolvedPath;
};

export default getBuildCacheDir;
