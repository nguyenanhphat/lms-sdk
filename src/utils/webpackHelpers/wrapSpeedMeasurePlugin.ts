import * as webpack from 'webpack';
import SpeedMeasurePlugin from 'speed-measure-webpack-plugin';

const wrapSpeedMeasurePlugin = (
  configuration: webpack.Configuration,
): webpack.Configuration => {
  const smp = new SpeedMeasurePlugin({
    outputFormat: 'humanVerbose',
    outputTarget: console.log,
  });

  return smp.wrap(configuration);
};

export default wrapSpeedMeasurePlugin;
