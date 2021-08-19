import {
  TargetType,
  ModeType,
  PlatformType,
  TestPlatformType,
  ArgvType,
  RunType,
} from '../const';

export interface CommandArgs {
  argv: ArgvType;
  build?: string;
  clearCache?: boolean;
  info?: boolean | string;
  mode: ModeType;
  platform: PlatformType;
  run?: RunType;
  setupTest?: string;
  target: TargetType;
  watch?: boolean;
}

export type TestCommandArgs = CommandArgs & {
  platform: TestPlatformType;
};
