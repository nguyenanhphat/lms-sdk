import * as webpack from 'webpack';
import getEnvConfig from '../getEnvConfig';
import { TargetType, ModeType } from '../../const';
import {
  initialOnWeb,
  initialOnNode,
} from '../webpackHelpers/classNameGenerator';
import { logIfError } from '../catchError';

class CustomClassNameHandler {
  name: string;

  constructor() {
    this.name = 'CustomClassNameHandler';
  }

  apply(compiler: webpack.Compiler) {
    const envConfig = getEnvConfig();
    const shouldCustomClassName = !envConfig.buildToolCssModuleLocalIdent;
    if (!shouldCustomClassName) {
      return;
    }

    let flush;
    const isModeProduction = compiler.options.mode === ModeType.production;
    const isTargetWeb = compiler.options.target === TargetType.web;
    const isTargetNode = compiler.options.target === TargetType.node;
    const outputDir = compiler.options.output.path;

    compiler.hooks.make.tapAsync(this.name, (compilation, callback) => {
      if (isTargetWeb) {
        flush = initialOnWeb();
        callback();
        return;
      }

      if (isTargetNode) {
        flush = initialOnNode();
        callback();
        return;
      }
    });

    compiler.hooks.afterEmit.tap(
      this.name,
      logIfError(() => {
        const shouldFlush = isModeProduction && typeof flush === 'function';
        if (!shouldFlush) {
          return;
        }
        flush(outputDir);
      }),
    );
  }
}

export default CustomClassNameHandler;
