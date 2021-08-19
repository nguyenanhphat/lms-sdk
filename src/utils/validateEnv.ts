import chalk from 'chalk';
import validator from 'validator';
import { getAppConfig } from './getAppConfig';
import { SchemaEnvironments, SchemaEnvironmentType } from '../const';

const schemaEnvironmentsOfTools: SchemaEnvironments = {
  BUILD_TOOL_ENABLE_DEBUG_CSS: [SchemaEnvironmentType.number],
  BUILD_TOOL_CSS_MODULE_LOCAL_IDENT: [
    SchemaEnvironmentType.string,
    { required: false },
  ],
  BUILD_TOOL_ENABLE_DEBUG_JS: [SchemaEnvironmentType.number],
  BUILD_TOOL_ENABLE_BUNDLE_ANALYZER: [SchemaEnvironmentType.number],
  BUILD_TOOL_ENABLE_CACHE: [SchemaEnvironmentType.number],
  BUILD_TOOL_CACHE_DIRECTORY: [SchemaEnvironmentType.string],
  BUILD_TOOL_CACHE_TIMEOUT: [SchemaEnvironmentType.number],
  BUILD_TOOL_CACHE_SIZE_THRESHOLD: [SchemaEnvironmentType.number],
  BUILD_TOOL_ENABLE_PARALLEL_COMPILE: [SchemaEnvironmentType.number],
  BUILD_TOOL_WORKER_PARALLEL_JOBS: [SchemaEnvironmentType.number],
  BUILD_TOOL_WORKER_POOL_TIMEOUT: [SchemaEnvironmentType.number],
  BUILD_TOOL_MODULE_ID_HASH_FUNC: [SchemaEnvironmentType.string],
  BUILD_TOOL_MODULE_ID_HASH_DIGEST: [SchemaEnvironmentType.string],
  BUILD_TOOL_MODULE_ID_HASH_DIGEST_LEN: [SchemaEnvironmentType.number],
  BUILD_TOOL_ENABLE_JS_SOURCE_MAP: [SchemaEnvironmentType.number],
  BUILD_TOOL_ENABLE_DETECT_DUPLICATE_PACKAGE: [SchemaEnvironmentType.number],
};

const listBasedOnTypes = {
  boolean: [validator.isBoolean],
  number: [validator.isInt],
  port: [validator.isPort],
  url: [validator.isURL],
  string: [validator.isAscii],
};

const getCheckerByType = (type: string) => {
  const checkerOnType = listBasedOnTypes[type];
  if (!checkerOnType) {
    return;
  }
  return checkerOnType;
};

export const getInvalidEnv = (schemaEnvironments: SchemaEnvironments) => {
  const keyOfEnv = Object.keys(schemaEnvironments);
  const listOfInvalid = keyOfEnv.reduce((acc, key: string) => {
    const value = process.env[key];
    const schema = schemaEnvironments[key];

    const [type, options] = schema;
    const { required = false } = options || {};
    if (!required && !value) {
      return acc;
    }

    const [checker, parser] = getCheckerByType(type);
    if (!checker) {
      console.error(
        chalk.red(
          `Missing checker for ${chalk.bold(type)} of ${chalk.bold(key)}.`,
        ),
      );
      acc.push([key, type]);
      return acc;
    }

    try {
      const raw = !parser ? value : parser(value);
      const isInvalid = !checker(raw);
      if (isInvalid) {
        acc.push([key, type]);
      }
    } catch {
      acc.push([key, type]);
    }

    return acc;
  }, []);

  return listOfInvalid;
};

export const validateEnv = () => {
  const factoryConfig = getAppConfig();
  const appConfig = factoryConfig();

  const { schemaEnvironments: schemaEnvironmentsOfApp } = appConfig;
  if (!schemaEnvironmentsOfApp) {
    console.warn(
      chalk.yellow(
        `Should add ${chalk.bold(
          'schemaEnvironments',
        )} field to config for validate environment variables!`,
      ),
    );
    return;
  }

  const invalidEnvList = getInvalidEnv({
    ...schemaEnvironmentsOfTools,
    ...schemaEnvironmentsOfApp,
  });
  if (invalidEnvList.length === 0) {
    return;
  }

  console.error(
    chalk.red(
      [
        `Environments config is missing or invalid fields:`,
        ...invalidEnvList.map(
          ([env, type]) =>
            `- ${chalk.bold(env)}, allow type is ${chalk.bold(type)}`,
        ),
      ].join('\n'),
    ),
  );
  process.exit(1);
};

export default validateEnv;
