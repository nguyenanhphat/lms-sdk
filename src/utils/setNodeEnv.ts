import { ModeType } from '../const';
import getEnvConfig from './getEnvConfig';

export default (mode: ModeType) => {
  process.env.NODE_ENV = mode;
  getEnvConfig.flush();
};
