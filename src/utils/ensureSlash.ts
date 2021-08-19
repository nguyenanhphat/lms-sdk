export function ensureSlash(path: string, needsSlash: boolean): string {
  const typeofPath = typeof path;
  if (typeofPath !== 'string') {
    throw new Error(`Path received type is ${typeofPath} not is a string`);
  }

  const hasSlash = (path || '').endsWith('/');
  if (hasSlash && !needsSlash) {
    return path.substr(0, path.length - 1);
  }

  if (!hasSlash && needsSlash) {
    return `${path}/`;
  }

  return path;
}

export default ensureSlash;
