import chalk from 'chalk';
import sinon from 'sinon';
import Runtime from 'jest-runtime';
import runSetupTest from './runSetupTest';
import ConextWorker from './contextWorker';
import {
  GlobalBrowser,
  SetupTestConfig,
} from '../../interfaces/testRunner.interface';
import pickHelpers from '../../runners/test/pickHelpers';
import pickEnvironments from '../../runners/test/pickEnvironments';

const pathOfHelpersFactory = require.resolve('./helpersFactory');
const pathOfEnvironmentsFactory = require.resolve('./environmentsFactory');

function getGlobalLibraries() {
  const Sinon = sinon.createSandbox();
  return { Sinon };
}

function installTestTools(
  globalOfEnvironment: GlobalBrowser,
  runtime: Runtime,
) {
  let testConfig: SetupTestConfig = {};
  try {
    const moduleRequire = (modulePath: string) =>
      runtime.requireModule(require.resolve(modulePath));
    testConfig = runSetupTest({}, moduleRequire) || {};
  } catch (error) {
    console.error(chalk.red(error.message));
  }

  const { Sinon } = getGlobalLibraries();
  globalOfEnvironment.Sinon = Sinon;

  const helpersFactory = runtime.requireModule(pathOfHelpersFactory).default;
  const environmentsFactory = runtime.requireModule(pathOfEnvironmentsFactory)
    .default;

  const defaultEnvironments = environmentsFactory();
  const context = new ConextWorker(
    pickEnvironments(
      [].concat(defaultEnvironments, testConfig.environments || []),
    ),
    globalOfEnvironment,
  );
  globalOfEnvironment.Context = context;

  const defaultHelpers = helpersFactory();
  const helpers = pickHelpers(
    Object.assign({}, defaultHelpers, testConfig.helpers),
  );
  globalOfEnvironment.Helpers = helpers;

  return globalOfEnvironment;
}

export default installTestTools;
