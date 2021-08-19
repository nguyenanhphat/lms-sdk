import paths from '../paths';

export function getShortSrc(src: string) {
  let newSrc = src.replace(paths.resolveInWorkspaceFolder('packages'), '');
  newSrc = newSrc.replace(paths.resolveInAppPath('/'), '');
  const s = newSrc.split('node_modules');
  if (s.length === 2) {
    newSrc = `node_modules${s.slice(-1)[0]}`;
  }
  return newSrc;
}
