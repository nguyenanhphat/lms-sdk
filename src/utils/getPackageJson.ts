import paths from '../paths';
import _memoize from 'lodash/memoize';
import { PackageJson } from '../const';

const getPackageJson = _memoize(
  (pkgPath = paths.appPackageJson): PackageJson => require(pkgPath),
);

export default getPackageJson;
