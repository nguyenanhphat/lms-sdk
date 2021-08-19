import webpack from 'webpack';
import { statsBundle } from './runWebpackCompiler';

const defaultWatchOptions = {
  aggregateTimeout: 750,
  poll: 1250,
};

export function runWebpackWatch(config: webpack.Configuration) {
  // tslint:disable-next-line:no-empty
  const resolve = ({ stats, warnings }) => {};
  // tslint:disable-next-line:no-empty
  const reject = (error: Error) => {};
  const compiler: webpack.Compiler = webpack(config);
  const watching = compiler.watch(
    config.watchOptions || defaultWatchOptions,
    statsBundle(resolve, reject),
  );
  return watching;
}

export default runWebpackWatch;
