import * as webpack from 'webpack';
import { ConcatSource } from 'webpack-sources';
import { SourceMapHandlerOptions } from '../../const';
import { logIfError } from '../catchError';

const REGEXP_ASSETS_DIR = /^(static\/(js|css)([\s\S]+)([^.map]+))$/i;

const REGEXP_SOURCE_MAP = /(\n([\S\s]+))(sourceMappingURL=(([\s\S]+)(.map)))/i;
const getMatchSourceMap = (code: string): string[] =>
  (code || '').match(REGEXP_SOURCE_MAP) || [];

const defaultAssetNameRegExp = REGEXP_ASSETS_DIR;

class SourceMapHandler {
  readonly assetNameRegExp: SourceMapHandlerOptions['assetNameRegExp'];
  readonly name: string;

  constructor(options?: SourceMapHandlerOptions) {
    this.name = 'SourceMapHandler';
    const { assetNameRegExp = defaultAssetNameRegExp } = options || {};
    this.assetNameRegExp = assetNameRegExp;
  }

  apply(compiler: webpack.Compiler) {
    if (compiler.options.devtool !== 'source-map') {
      return;
    }
    compiler.hooks.make.tap(this.name, compilation => {
      compilation.hooks.optimizeAssets.tap(
        this.name,
        logIfError(assets => {
          const { publicPath } = compiler.options.output;
          const keys = Object.keys(assets);
          const matches = keys.filter(assetName =>
            this.assetNameRegExp.test(assetName),
          );
          try {
            matches.forEach(assetName => {
              const asset = assets[assetName];
              const source = asset.source();
              const matched = getMatchSourceMap(source);
              if (matched.length === 0) {
                return false;
              }
              const sourceMap = publicPath + assetName + '.map';
              const newSource = new ConcatSource(
                source.replace(matched[4], sourceMap),
              );
              compilation.assets[assetName] = newSource;
              return true;
            });
          } catch (error) {
            throw error;
          }
          return true;
        }),
      );
    });
  }
}

export default SourceMapHandler;
