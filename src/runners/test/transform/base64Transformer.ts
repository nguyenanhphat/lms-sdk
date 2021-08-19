import path from 'path';
import mime from 'mime-types';
import exportForEs5 from '../../../utils/exportForEs5';

export const process = (src: string, filename: string): string =>
  exportForEs5(
    `data:${mime.lookup(filename) || ''},${path.basename(filename)}`,
  );
