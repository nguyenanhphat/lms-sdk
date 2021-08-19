const REG_EXP_NAME_BREAK_CHAR = /[\s,.{/#[:]/;

export default (css: string, path: string): object => {
  const end: number = css.length;
  let i = 0;
  let char: string;
  let bracketsCount: number = 0;
  const result = {};
  const resultAnimations = {};

  while (i < end) {
    if (i === -1) {
      throw Error(`Parse error ${path}`);
    }

    if (css.indexOf('/*', i) === i) {
      i = css.indexOf('*/', i + 2);

      // Unclosed comment. Break to avoid infinity loop
      if (i === -1) {
        // Don't parse, but save collected result
        return result;
      }

      continue;
    }

    char = css[i];

    if (char === '{') {
      bracketsCount++;
      i++;
      continue;
    }

    if (char === '}') {
      bracketsCount--;
      i++;
      continue;
    }

    if (char === '"' || char === '\'') {
      do {
        i = css.indexOf(char, i + 1);
        if (i === -1) {
          return result;
        }
      } while (css[i - 1] === '\\');
      i++;
      continue;
    }

    if (bracketsCount > 0) {
      i++;
      continue;
    }

    if (char === '.' || char === '#') {
      i++;
      const startWord = i;

      while (!REG_EXP_NAME_BREAK_CHAR.test(css[i])) {
        i++;
      }
      const word = css.slice(startWord, i);

      result[word] = word;
      continue;
    }

    if (css.indexOf('@keyframes', i) === i) {
      i += 10;
      while (REG_EXP_NAME_BREAK_CHAR.test(css[i])) {
        i++;
      }

      const startWord = i;
      while (!REG_EXP_NAME_BREAK_CHAR.test(css[i])) {
        i++;
      }

      const word = css.slice(startWord, i);
      resultAnimations[word] = word;
      continue;
    }

    i++;
  }

  return Object.assign(result, resultAnimations);
};
