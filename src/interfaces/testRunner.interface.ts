import * as React from 'react';
import * as Enzyme from 'enzyme';
import * as Sinon from 'sinon';
import JSDOMEnvironment from 'jest-environment-jsdom';
import { EnvironmentType } from './environment.interface';

export interface SetupTestConfig {
  environments?: EnvironmentType[];
  helpers?: HelpersType;
}

export interface TestRunner {
  setupTestConfig: SetupTestConfig;
}

export interface HelpersType {
  [k: string]: (...rest: any[]) => any;
}

export interface WrapperType {
  component: React.ElementType;
  defaultProps?: React.ComponentProps<'object'> | typeof Function | null;
  key?: string;
  name: string;
  propsFactory?(config: any): React.ComponentProps<'object'>;
}

export interface GlobalBrowserExtend {
  Context?: any;
  Enzyme?: typeof Enzyme | null;
  Helpers?: HelpersType | null;
  jsdom: typeof JSDOMEnvironment.prototype.dom;
  React?: typeof React | null;
  setGlobal?: (fn: () => void) => any;
  Sinon?: typeof Sinon | Sinon.SinonSandbox;
}

export type GlobalBrowser = typeof JSDOMEnvironment.prototype.global &
  GlobalBrowserExtend;

export interface TargetSideVariables {
  __CLIENT__: boolean;
  __SERVER__: boolean;
}

export type GlobalBrowserTargetSide = GlobalBrowser &
  TargetSideVariables & {
    __backedupContextVariables?: TargetSideVariables;
  };

export interface PackageFactory {
  environmentsFactory: () => EnvironmentType[];
  helpersFactory: () => HelpersType;
}
