import { PlatformType } from '../const';

const bindPlatformToExtensions = (
  platform: PlatformType | null,
  extensions: string[],
  haveDot: boolean = true,
): string[] => {
  if (!platform) {
    return [];
  }

  return extensions.map(
    (c: string): string => `${haveDot ? '.' : ''}${platform}.${c}`,
  );
};

export default bindPlatformToExtensions;
