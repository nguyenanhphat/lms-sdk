import _pick from 'lodash/pick';
import { GlobalBrowserTargetSide } from '../../interfaces/testRunner.interface';
import chalk from 'chalk';

const targetSide = {
  name: 'target-side',
  setup: (globalVariables: GlobalBrowserTargetSide, isClient: boolean) => {
    if ('__backedupContextVariables' in globalVariables) {
      console.warn(
        chalk.yellow(
          'Having enabled "target-side" environment before, please check agian!',
        ),
      );
      return;
    }

    const contextVariables = isClient
      ? {
          __CLIENT__: true,
          __SERVER__: false,
        }
      : {
          __CLIENT__: false,
          __SERVER__: true,
        };

    const keyOfVariables = Object.keys(contextVariables);
    const backedupContextVariables = _pick(globalVariables, keyOfVariables);

    Object.assign(globalVariables, contextVariables, {
      __backedupContextVariables: backedupContextVariables,
    });
  },

  teardown: (globalVariables: GlobalBrowserTargetSide) => {
    if ('__backedupContextVariables' in globalVariables) {
      Object.assign(
        globalVariables,
        globalVariables.__backedupContextVariables,
      );
      delete globalVariables.__backedupContextVariables;
    }
  },
};

const environmentsFactory = () => [targetSide];

export default environmentsFactory;
