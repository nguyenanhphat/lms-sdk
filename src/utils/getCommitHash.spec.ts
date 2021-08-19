describe('Exported functions', () => {
  test('Exported default function', () => {
    const { default: getCommitHash } = require('./getCommitHash');
    expect(getCommitHash).toBeInstanceOf(Function);
  });
});

describe('Workflow', () => {
  test('Commit hash is valid', () => {
    const { default: getCommitHash } = require('./getCommitHash');
    const cacheId = getCommitHash();
    expect(typeof cacheId).toEqual('string');

    const idIsValid = cacheId === '"__COMIT_HASH__"' || cacheId.length === 8;
    expect(idIsValid).toEqual(true);
  });
});
