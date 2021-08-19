import JSDOMEnvironment from 'jest-environment-jsdom';
import { EnvironmentContext } from '@jest/environment';
import { Config } from '@jest/types';
import { Script } from 'vm';
import Runtime from 'jest-runtime';
import { GlobalBrowser } from '../../../interfaces/testRunner.interface';
import runGarbageCollector from '../../../utils/runGarbageCollector';
import notifyLeakingBeforeExit from '../../../utils/notifyLeakingBeforeExit';
import ProcessLeaksDetector from '../../../utils/processLeaksDetector';
import installTestTools from '../installTestTools';

const leaksDetector = new ProcessLeaksDetector(3);

class BrowserEnvironment extends JSDOMEnvironment {
  public global: GlobalBrowser;

  constructor(config: Config.ProjectConfig, context: EnvironmentContext = {}) {
    super(config, context);
  }

  private toolsInstalled: boolean;

  public prepare(runtime: Runtime) {
    this.installTools(runtime);
  }

  public runScript(script: Script) {
    return super.runScript(script);
  }

  async setup() {
    await super.setup();
    return Promise.resolve();
  }

  async teardown() {
    const keysOfExtendedGlobal = [
      'Helpers',
      'Context',
      'React',
      'Enzyme',
      'Sinon',
    ];

    for (const key of keysOfExtendedGlobal) {
      const item = this.global[key];
      if (item) {
        const shouldCloseContext = 'close' in item;
        if (shouldCloseContext) {
          item.close();
        }

        delete this.global[key];
      }
    }

    this.toolsInstalled = false;

    await super.teardown();
    await runGarbageCollector();

    const isProcessLeaking = leaksDetector.snapshot(false);
    if (isProcessLeaking) {
      notifyLeakingBeforeExit();
    }

    return Promise.resolve();
  }

  private installTools(runtime: Runtime) {
    if (this.toolsInstalled) {
      return;
    }

    installTestTools(this.global, runtime);
    this.toolsInstalled = true;
  }
}

module.exports = BrowserEnvironment;
