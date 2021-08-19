import {
  GlobalBrowser,
  HelpersType,
  WrapperType,
} from './testRunner.interface';

export interface EnvironmentType {
  helpers?: HelpersType;
  name: string;
  wrappers?: WrapperType[];
  setup(context: GlobalBrowser, ...rest: any[]): Promise<void>;
  teardown(context: GlobalBrowser, ...rest: any[]): Promise<void>;
}
