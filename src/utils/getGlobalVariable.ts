import { OverrideGlobalVariables } from '../const';

function getGlobalVariable(overide: OverrideGlobalVariables) {
  return {
    __SERVER__: false,
    __CLIENT__: false,
    __MAJOR_VERSION__: '"__MAJOR_VERSION__"',
    __COMMIT_HASH__: '"__COMMIT_HASH__"',
    __WEB__: false,
    __WAP__: false,
    ...overide,
  };
}

export default getGlobalVariable;
