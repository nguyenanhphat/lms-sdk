import * as babel from '@babel/core';

interface BabelConfig {
  includeTypescript?: boolean;
}

export default (config?: BabelConfig): babel.TransformOptions => {
  const { includeTypescript = false } = config || {};

  return {
    presets: [
      require.resolve('@babel/preset-react'),
      includeTypescript && [
        require.resolve('@babel/preset-typescript'),
        {
          isTSX: true,
          allExtensions: true,
        },
      ],
      [
        require.resolve('@babel/preset-env'),
        {
          targets: {
            node: 'current',
          },
        },
      ],
    ].filter(Boolean),
    plugins: [
      require.resolve('babel-plugin-transform-react-remove-prop-types'),
      require.resolve('babel-plugin-transform-export-extensions'),
      require.resolve('@babel/plugin-proposal-class-properties'),
      require.resolve('@babel/plugin-proposal-object-rest-spread'),
      require.resolve('@babel/plugin-transform-exponentiation-operator'),
      require.resolve('babel-plugin-dynamic-import-node'),
    ],
    compact: true,
  };
};
