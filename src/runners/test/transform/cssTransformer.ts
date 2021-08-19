import { sep as pathSep } from 'path';
import sass from 'node-sass';
import postcss from 'postcss';
import postcssNested from 'postcss-nested';

import parseCssSelector from '../parseCssSelector';
import paths from '../../../paths';
import exportForEs5 from '../../../utils/exportForEs5';
import memoizeFn from '../../../utils/memoizeFn';
import { getSassModuleNameMapper } from '../getModuleNameMapper';

const postCssNested = postcss([postcssNested]);

const getStyleResolvePaths = (): string[] => [
  'node_modules',
  paths.nodeModules,
  paths.appSrc,
  paths.appPath,
  paths.resolveInAppPath('../'),
  paths.resolveInWorkspaceFolder('node_modules/'),
  paths.resolveInWorkspaceFolder(''),
];

const moduleNameMapper = getSassModuleNameMapper();

const importResolver = memoizeFn(
  (url: string, prev: string): string => {
    const listOfMapper = Object.entries(moduleNameMapper);
    const matchedMapper = listOfMapper.find(([regex]) =>
      new RegExp(regex).test(url),
    );
    if (!matchedMapper) {
      return url;
    }

    const [regexOfMapper, replacerOfMapper] = matchedMapper;
    const urlMapped = url.replace(new RegExp(regexOfMapper), replacerOfMapper);
    return urlMapped;
  },
);

export const process = (src: string, path: string): string => {
  const filename: string = path.slice(path.lastIndexOf(pathSep) + 1);
  const extention: string = filename.slice(filename.lastIndexOf('.') + 1);

  let textCss: string;
  switch (extention) {
    case 'sass':
    case 'scss':
      const sassConfig = {
        data: src,
        file: path,
        indentedSyntax: extention === 'sass',
        includePaths: getStyleResolvePaths(),
        precision: 5,
        constLoaders: true,
        importLoaders: 2,
        importer: (url, prev) => {
          const file = importResolver(url, prev);
          return { file };
        },
      };
      const compiled = sass.renderSync(sassConfig);
      textCss = String(compiled.css);
      break;
    case 'css':
    case 'pcss':
    case 'postcss':
      textCss = postCssNested.process(src).css;
      break;
    default:
      break;
  }

  return exportForEs5(parseCssSelector(textCss, path));
};
