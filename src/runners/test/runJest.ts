import jest from 'jest';
import parseJestArgv from './parseJestArgv';
import getJestConfig from './getJestConfig';
import { CommandArgs } from '../../interfaces/args.interface';

export const runJest = async (params: CommandArgs): Promise<any> => {
  const args = parseJestArgv(params);
  const jestConfig = getJestConfig(params);

  args.push('--config', JSON.stringify(jestConfig));

  const result = await jest.run(args);
  return result;
};

export default runJest;
