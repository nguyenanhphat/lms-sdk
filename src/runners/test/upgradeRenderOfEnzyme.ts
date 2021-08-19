import chalk from 'chalk';
import _get from 'lodash/get';
import * as React from 'react';
import { WrapperType } from '../../interfaces/testRunner.interface';
import { TestRenderOptions, TestRenderType, EnzymeWrapper } from '../../const';

const getDefaultProps = (
  defaultProps: WrapperType['defaultProps'],
): React.ComponentProps<'object'> | null => {
  if (typeof defaultProps === 'function') {
    return defaultProps();
  }
  return defaultProps;
};

const getInstanceHelpers = (instance: EnzymeWrapper) => ({
  getStore: () => {
    const provider = instance.find('ConnectStore').at(0);
    if (!provider.exists()) {
      console.error(chalk.red('Not found store data provider!'));
      return;
    }

    const store = (provider.instance() as any).store;
    if (!store) {
      console.error(chalk.red('Not found store data!'));
    }

    return store;
  },
  getHistory: () => {
    const provider = instance.find('ConnectHistory').at(0);
    if (!provider.exists()) {
      console.error(chalk.red('Not found history data provider!'));
      return;
    }

    const history = (provider.instance() as any).history;
    if (!history) {
      console.error(chalk.red('Not found history data!'));
    }

    return history;
  },
});

const bindHelpersToRenderer = (instance: EnzymeWrapper | null): boolean => {
  if (!instance) {
    return false;
  }

  const instanceHelpers = getInstanceHelpers(instance);
  Object.assign(instance, instanceHelpers);
  return true;
};

function upgradeRenderOfEnzyme(Enzyme, type: TestRenderType) {
  const originalFn = Enzyme[type];
  const overrideFn = (
    children: React.ReactElement<any>,
    options: TestRenderOptions,
  ) => {
    const { buildProps = null, ...rest } = options || {};
    const wrappers = (Enzyme as any).wrapperComponents || [];

    let Component = children;
    try {
      for (const wrapper of wrappers) {
        const { key, component, defaultProps, propsFactory } = wrapper;
        const configProps = _get(buildProps, key);
        const shouldFactory = typeof propsFactory === 'function' && configProps;
        const props = shouldFactory
          ? propsFactory(configProps)
          : getDefaultProps(defaultProps);

        Component = React.createElement(component, props, Component);
      }
    } catch (error) {
      console.error(
        chalk.red(
          'Can not wrap the component with wrappers, please check below error!',
        ),
      );
      console.error(error);
      Component = children;
    }

    const instance: EnzymeWrapper = originalFn(Component, rest);
    bindHelpersToRenderer(instance);

    return instance;
  };

  Object.assign(Enzyme, {
    [type]: overrideFn,
    [`_${type}`]: originalFn,
  });
}

export default upgradeRenderOfEnzyme;
