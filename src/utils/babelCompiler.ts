import { transform, transformFileSync } from '@babel/core';

export default (
  src: string,
  options?: { [k: string]: any },
  isCode?: boolean,
) => {
  const handler = isCode ? transform : transformFileSync;
  return handler(src, options);
};
