/**
 * ref from css-loader
 * https://github.com/webpack-contrib/css-loader/blob/9c3571ca9461b9c7deaaa347de38f57bbb1be11b/src/utils.js#L60
 */

const whitespace = '[\\x20\\t\\r\\n\\f]';
const unescapeRegExp = new RegExp(
  `\\\\([\\da-f]{1,6}${whitespace}?|(${whitespace})|.)`,
  'ig',
);

const unescape = (str: string) =>
  str.replace(
    unescapeRegExp,
    (_, escaped, escapedWhitespace): string => {
      // @ts-ignore
      const high = `0x${escaped}` - 0x10000;

      /* eslint-disable line-comment-position */
      // NaN means non-codepoint
      // Workaround erroneous numeric interpretation of +"0x"
      // eslint-disable-next-line no-self-compare
      return high !== high || escapedWhitespace
        ? escaped
        : high < 0
        ? // BMP codepoint
          String.fromCharCode(high + 0x10000)
        : // Supplemental Plane codepoint (surrogate pair)
          // tslint:disable-next-line:no-bitwise
          String.fromCharCode((high >> 10) | 0xd800, (high & 0x3ff) | 0xdc00);
      /* eslint-enable line-comment-position */
    },
  );

export default unescape;
