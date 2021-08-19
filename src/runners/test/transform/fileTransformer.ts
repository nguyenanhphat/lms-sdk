import path from 'path';
import exportForEs5 from '../../../utils/exportForEs5';

export const process = (src: string, filename: string): string =>
  exportForEs5(path.basename(filename));
