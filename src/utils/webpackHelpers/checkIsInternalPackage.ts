const includesModules = [
  'react',
  'react-dom',
  'dom7',
  'swiper',
  'strict-uri-encode',
  'query-string',
  'split-on-first',
  'redux-form',
  'bootstrap',
  'lodash',
  'lodash-es',
  'node_modules.{0,2}fundoo-',
  'node_modules.{0,2}@fundoo',
];
const excludesModules = [];

export function checkIsInternalPackage(file: string): boolean {
  const excludeModulesReg = new RegExp(excludesModules.join('|'), 'g');
  if (excludesModules.length > 0 && excludeModulesReg.test(file)) {
    return false;
  }
  const nodeModulesReg = new RegExp('node_modules', 'g');
  const includeModulesReg = new RegExp(includesModules.join('|'), 'g');
  return !nodeModulesReg.test(file) || includeModulesReg.test(file);
}

export default checkIsInternalPackage;
