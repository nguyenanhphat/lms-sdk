const REGEXP_APP_NAME = /fundoo-([^\/]+)/i;
const REGEXP_CLASS_NAME = /(.s?css\+)/i;
const REGEXP_SHORT_NAME = /((\/|^|([^a-zA-Z0-9]+))?(src|node_modules|components|styles)\/)/g;

export const getShortName = (key: string): string => {
  let shortName = (key || '')
    .replace(REGEXP_SHORT_NAME, '$2')
    .replace(REGEXP_CLASS_NAME, '+');
  const matchs = shortName.match(REGEXP_APP_NAME);
  if (matchs) {
    const appFullName = matchs[0];
    const appShortName = appFullName
      .split('-')
      .map(word => (word || '')[0])
      .join('');
    shortName = shortName.replace(appFullName, appShortName);
  }
  return shortName;
};

export default function shortenKeyInDictClassName(dict: object): object {
  const keyOfDict = Object.keys(dict);
  const object = keyOfDict.reduce((acc, key) => {
    const shortName = getShortName(key);
    if (!shortName || acc[shortName]) {
      // tslint:disable-next-line:max-line-length
      throw new Error(`Duplicate in dict of classname when shortening key! Shorted name: "${shortName}"`);
    }
    acc[shortName] = dict[key];
    return acc;
  }, {});
  return object;
}
