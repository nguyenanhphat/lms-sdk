import * as webpack from 'webpack';

export default function getNodeConfig(
  buildTarget: webpack.Configuration['target'],
): webpack.Configuration['node'] {
  const nodeConfig =
    buildTarget === 'web'
      ? {
          dgram: 'empty',
          fs: 'empty',
          net: 'empty',
          tls: 'empty',
          child_process: 'empty',
        }
      : {
          __dirname: false,
        };

  return nodeConfig as webpack.Configuration['node'];
}
