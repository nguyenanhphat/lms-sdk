import * as webpack from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

const appendBundleAnalyzerPlugin = (
  configuration: webpack.Configuration,
  commitHash: string,
): webpack.Configuration => {
  configuration.plugins.push(
    new BundleAnalyzerPlugin({
      openAnalyzer: false,
      analyzerMode: 'static',
      reportFilename: `report.${commitHash}.html`,
    }),
  );

  return configuration;
};

export default appendBundleAnalyzerPlugin;
