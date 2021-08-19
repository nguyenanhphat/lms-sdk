import nodeObjectHash from 'node-object-hash';

const sha1 = nodeObjectHash({ alg: 'sha1', sort: true });

export default (data, length: number = 8): string =>
  sha1.hash(data).substr(0, length);
