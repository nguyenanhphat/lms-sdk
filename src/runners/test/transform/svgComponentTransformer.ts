import * as babel from '@babel/core';
import path from 'path';
import getBabelConfig from '../getBabelConfig';

const babelConfig = getBabelConfig();

const getSource = (filename: string): string => `
  import React from 'react';
  export default (props) => (<svg {...props} data-filename="${filename}" />);
`;

export const process = (src: string, filename: string): string =>
  babel.transform(getSource(path.basename(filename)), {
    ...babelConfig,
    filename,
    retainLines: true,
  }).code;
