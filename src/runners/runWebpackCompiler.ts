import webpack from 'webpack';
import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages';

export const statsBundle = (resolve, reject): webpack.Compiler.Handler => (
  err,
  stats,
) => {
  let messages;
  const jsonStats = (stats &&
    stats.toJson({
      warnings: true,
      errors: true,
      assets: false,
      chunks: false,
      modules: false,
      children: false,
    })) || {
    errors: [],
    warnings: [],
    version: '',
    _showErrors: false,
    _showWarnings: false,
  };
  if (err) {
    if (!err.message) {
      return reject(new Error(messages.errors.join('\n\n')));
    }
    messages = formatWebpackMessages({
      errors: [err.message],
      warnings: [],
    } as any);
  } else {
    messages = formatWebpackMessages(jsonStats as any);
  }
  if (messages.errors.length) {
    if (messages.errors.length > 1) {
      messages.errors.length = 1;
    }
    return reject(new Error(messages.errors.join('\n\n')));
  }

  return resolve({
    stats: jsonStats,
    warnings: messages.warnings,
  });
};

export function runWebpackCompiler(
  config: webpack.Configuration,
): Promise<{
  stats: any;
  warnings: any[];
}> {
  const compiler: webpack.Compiler = webpack(config);
  return new Promise((resolve, reject) => {
    compiler.run(statsBundle(resolve, reject));
  });
}

export default runWebpackCompiler;
