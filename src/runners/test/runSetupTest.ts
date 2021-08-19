import fs from 'fs-extra';
import path from 'path';
import _pick from 'lodash/pick';
import { SETUP_TEST_PATH } from '../../enums';
import { SetupTestConfig } from '../../interfaces/testRunner.interface';

function runSetupTest(config, requireModule): SetupTestConfig | null {
  const pathOfSetupTest = process.env[SETUP_TEST_PATH];
  if (!pathOfSetupTest) {
    return;
  }

  if (!fs.existsSync(pathOfSetupTest)) {
    throw new Error(`setupTest is missing`);
  }

  let setupTest;
  try {
    setupTest = requireModule(pathOfSetupTest).default;
  } catch (error) {
    throw error;
  }

  const fileIsFunction = typeof setupTest === 'function';
  if (!fileIsFunction) {
    throw new Error(`setupTest must export a default function`);
  }

  const setupTestConfig: SetupTestConfig = setupTest(config);
  return setupTestConfig;
}

export function flushSetupTest() {
  const pathOfSetupTest = process.env[SETUP_TEST_PATH];
  fs.emptyDirSync(path.dirname(pathOfSetupTest));
  delete process.env[SETUP_TEST_PATH];
  return true;
}

export default runSetupTest;
