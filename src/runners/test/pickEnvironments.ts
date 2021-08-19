import { EnvironmentType } from '../../interfaces/environment.interface';

const pickEnvironments = (
  enviroments: EnvironmentType[] | null,
): EnvironmentType[] =>
  (enviroments || []).filter(
    enviroment =>
      !!enviroment.name && !!enviroment.setup && !!enviroment.teardown,
  );

export default pickEnvironments;
