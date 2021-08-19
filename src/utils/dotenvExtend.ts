import _transform from 'lodash/transform';
import _get from 'lodash/get';
import { Argv } from 'yargs';
import { CommandArgs } from '../interfaces/args.interface';
import { existsSync } from './fsExtend';
import paths from '../paths';

const requireEnvironment = () => {
  process.env.PUBLIC_URL = process.env.PUBLIC_URL || '';
};

const overrideEnv = (params?: Argv<CommandArgs>) => {
  const isEnableCacheFromArgv = !!_get(params, 'argv.cache');
  if (isEnableCacheFromArgv) {
    process.env.BUILD_TOOL_ENABLE_CACHE = '1';
  }
};

const dotendExtend = (params?: Argv<CommandArgs>) => {
  delete require.cache[require.resolve('../paths')];

  const dotenvFiles = [`${paths.dotenv}.static`, paths.dotenv].filter(Boolean);
  dotenvFiles.forEach(dotenvFile => {
    if (existsSync(dotenvFile)) {
      require('dotenv-expand')(
        require('dotenv').config({
          path: dotenvFile,
        }),
      );
    }
  });

  requireEnvironment();
  overrideEnv(params);
};

export default (params?: Argv<CommandArgs>) => {
  if (!('__isAppliedConfig' in dotendExtend)) {
    dotendExtend(params);
    Object.defineProperty(dotendExtend, '__isAppliedConfig', {
      value: true,
      enumerable: true,
    });
  }
};
