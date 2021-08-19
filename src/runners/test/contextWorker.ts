import chalk from 'chalk';
import { EnvironmentType } from '../../interfaces/environment.interface';
import {
  GlobalBrowser,
  WrapperType,
} from '../../interfaces/testRunner.interface';
import pickHelpers from '../../runners/test/pickHelpers';

const duplicatedHelperWarning = (name: string) => {
  console.log(
    chalk.yellow(
      `"${name}" fn has existed in Helpers, it will have been to override!`,
    ),
  );
};

const duplicatedEnvironmentWarning = (name: string) => {
  console.log(
    chalk.yellow(
      `"${name}" fn has existed in Environments, it will have been to override!`,
    ),
  );
};

class ContextWorker {

  constructor(environments: EnvironmentType[], global: GlobalBrowser) {
    this.environments = new Map();
    this.global = global;

    (environments || []).forEach(this.setEnvironment);
  }
  private environments: Map<EnvironmentType['name'], EnvironmentType>;
  private global: GlobalBrowser;

  close = () => {
    this.global = null;
    this.environments = null;
  }

  public disable = (name: string, ...rest: any[]): boolean => {
    const environment = this.environments.get(name);
    if (!environment) {
      return false;
    }

    const shouldRunTeardown = typeof environment.teardown === 'function';
    if (shouldRunTeardown) {
      environment.teardown(this.global, ...(rest || []));
    }

    const { helpers, wrappers } = environment;

    const shouldRemoveHelpers = typeof helpers === 'object';
    if (shouldRemoveHelpers) {
      const keyOfHelpers = Object.keys(pickHelpers(helpers));
      keyOfHelpers.forEach(key => {
        if (this.global.Helpers[key]) {
          delete this.global.Helpers[key];
        }
      });
    }

    const shouldRemoveRenderers = wrappers && !!wrappers.length;
    if (!shouldRemoveRenderers) {
      const Enzyme = this.global.Enzyme;
      if (!Enzyme) {
        console.log(chalk.red(`Not found Enzyme module!`));
      }

      const { wrapperComponents } = Enzyme as any;

      (this.global.Enzyme as any).wrapperComponents = (
        wrapperComponents || []
      ).filter(
        (wrapper: WrapperType): boolean =>
          (wrapper.key || '').split('.')[0] === name,
      );
    }

    return true;
  }

  public enable = (name: string, ...rest: any[]): boolean => {
    const environment = this.environments.get(name);
    if (!environment) {
      console.log(chalk.red(`Can not enable environment by name "${name}"!`));
      return false;
    }

    const shouldRunSetup = typeof environment.setup === 'function';
    if (shouldRunSetup) {
      environment.setup(this.global, ...(rest || []));
    }

    const { helpers, wrappers } = environment;

    const shouldBindHelpers = typeof helpers === 'object';
    if (shouldBindHelpers) {
      const validHelpers = Object.entries(pickHelpers(helpers));
      validHelpers.forEach(([key, fn]) => {
        const isCloned = this.global.Helpers[key] === fn;
        if (isCloned) {
          return;
        }

        if (this.global.Helpers[key]) {
          duplicatedHelperWarning(key);
        }

        this.global.Helpers[key] = fn;
      });
    }

    const shouldWrapRenderers = wrappers && !!wrappers.length;
    if (shouldWrapRenderers) {
      const Enzyme = this.global.Enzyme;
      if (!Enzyme) {
        console.log(chalk.red(`Not found Enzyme module!`));
      }

      const wrapperComponents = [];

      for (const wrapper of wrappers) {
        wrapper.key = `${name}.${wrapper.name}`;
        wrapperComponents.push(wrapper);
      }

      Object.assign(this.global.Enzyme, {
        wrapperComponents: ((Enzyme as any).wrapperComponents || [])
          .concat(wrapperComponents)
          .filter(Boolean),
      });
    }

    return true;
  }

  private readonly setEnvironment = (environment: EnvironmentType) => {
    const { name } = environment;
    if (this.environments.has(name)) {
      duplicatedEnvironmentWarning(name);
    }

    this.environments.set(environment.name, environment);
  }
}

export default ContextWorker;
