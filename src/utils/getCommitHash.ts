import GitRevisionPlugin from 'git-revision-webpack-plugin';

export default (): string => {
  let commitHash = '"__COMIT_HASH__"';
  try {
    commitHash = new GitRevisionPlugin().commithash().substring(0, 8);
  } catch (ex) {}

  return commitHash;
};
