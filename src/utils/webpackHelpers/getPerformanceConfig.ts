import * as webpack from 'webpack';

const getPerformanceConfig = (
  isDisabled: boolean,
): webpack.Configuration['performance'] => {
  const performanceConfig = isDisabled
    ? {
        hints: false,
      }
    : {
        maxEntrypointSize: 800000,
        maxAssetSize: 3000000,
        hints: 'warning',
      };

  return performanceConfig as webpack.Configuration['performance'];
};

export default getPerformanceConfig;
