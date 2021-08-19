import chalk from 'chalk';
import _get from 'lodash/get';
import _pickBy from 'lodash/pickBy';
import { Argv } from 'yargs';
import { CommandArgs } from './interfaces/args.interface';
import { getAppConfig } from './utils/getAppConfig';
import { webpackConfigFactory } from './utils/webpackConfigFactory';
import buildFullProcess from './runners/runWebpackBuild';
import {
  BuildTemplate,
  ModeType,
  FactoryConfig,
  BuildTemplateId,
} from './const';
import setNodeEnv from './utils/setNodeEnv';

const getTemplateId = (templateId: BuildTemplateId): string =>
  Array.isArray(templateId) ? templateId[0] : templateId;

const checkIsDefer = (templateId: BuildTemplateId): boolean =>
  Array.isArray(templateId) ? templateId[1] === -1 : false;

const transformBuildTemplate = async (template: BuildTemplate) => {
  const webpackConfig = await webpackConfigFactory(template as FactoryConfig);

  webpackConfig.entry = template.entry;
  Object.assign(webpackConfig.output, template.output);

  return {
    ...template,
    webpackConfig,
  };
};

const buildOnTemplate = async (buildTemplate: BuildTemplate): Promise<any> => {
  console.log(
    chalk.cyan(`Build script ${chalk.bold(buildTemplate.id)} is running.`),
  );

  const result = await buildFullProcess(buildTemplate.webpackConfig);

  console.log(
    chalk.cyan(`Build script ${chalk.bold(buildTemplate.id)} was build done!`),
  );
  console.log();

  return result;
};

export const checkBuildScript = async (params: Argv<CommandArgs>) => {
  setNodeEnv('production' as ModeType);

  const buildScriptId = (params.argv.build || '').toString();
  if (!buildScriptId) {
    return false;
  }
  console.log(
    `Starting to build with script id is ${chalk.bold('app config')}.`,
  );

  const configFactory = getAppConfig();
  if (!configFactory) {
    console.error(
      chalk.red(`Not found ${chalk.bold('app config')} file in app!`),
    );
    process.exit(1);
  }

  const appConfig = configFactory();
  const { buildScripts, buildTemplates } = appConfig;
  if (!buildScripts || !buildTemplates) {
    console.error(
      chalk.red(
        `Missing ${chalk.bold('buildScripts')} or ${chalk.bold(
          'buildTemplates',
        )} fields in config!`,
      ),
    );
    process.exit(1);
  }

  const buildScript: string[] = buildScripts[buildScriptId];
  if (!buildScript) {
    console.error(
      chalk.red(
        `Not found config for build script id ${chalk.bold(
          buildScriptId,
        )} in config!`,
      ),
    );
    process.exit(1);
  }

  const templatesMissing = buildScript.filter(
    (templateId) => !buildTemplates[getTemplateId(templateId)],
  );
  if (templatesMissing.length > 0) {
    console.error(
      chalk.red(
        `Missing templates "${chalk.bold(
          templatesMissing.join(', '),
        )}" in ${chalk.bold('buildTemplates')} field!`,
      ),
    );
    process.exit(1);
  }

  const mapOfBuildScript: BuildTemplate[] = buildScript.map(
    (templateId, idx) => {
      const id = getTemplateId(templateId);
      const isDefer = checkIsDefer(templateId);
      return {
        ...buildTemplates[id],
        id,
        isDefer,
        index: idx,
      };
    },
  );

  console.log(`Mapping and config build scripts with templates.`);
  console.log();

  process.env.IS_CUSTOM_BUILD_MODE = '1';

  const promiseToTransformBuildTemplates = (mapOfBuildScript || []).map(
    transformBuildTemplate,
  );
  const listOfBuildTemplates = await Promise.all(
    promiseToTransformBuildTemplates,
  );

  const [orderBuildTemplates, deferBuildTemplates] =
    listOfBuildTemplates.reduce(
      (acc, item) => {
        if ((item as any).isDefer) {
          acc[1].push(item);
        } else {
          acc[0].push(item);
        }

        return acc;
      },
      [[], []],
    );

  console.log(
    chalk.blue(
      `Total build templates have ${chalk.bold(
        (orderBuildTemplates.length + deferBuildTemplates.length).toString(),
      )} item(s), with ${chalk.bold(
        deferBuildTemplates.length.toString(),
      )} defer item(s)`,
    ),
  );

  console.log(`Prepared was done, starting to run build.`);
  console.log();

  const deferCompilers = deferBuildTemplates.map(buildOnTemplate);
  const deferResults = [];

  if (deferCompilers.length > 0) {
    const results = await Promise.all(deferCompilers);
    deferResults.push(...results);

    console.log(`All defer build templates was done!`);
    console.log();
  }

  const orderResults = [];
  for (const orderCompiler of orderBuildTemplates) {
    const result = await buildOnTemplate(orderCompiler);
    orderResults.push(result);
  }

  console.log(`Build process was done!`);

  process.exit(0);
  return true;
};
