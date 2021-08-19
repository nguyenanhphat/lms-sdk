import crypto from 'crypto';
import fs from 'fs-extra';
import rimraf from 'rimraf';

const DEFAULT_ENCODING = 'utf8';

export const createEmptyFile = (path: string) => {
  fs.closeSync(fs.openSync(path, 'w'));
};

export const checksum = (data, algorithm?: string, encoding?: any): string =>
  crypto
    .createHash(algorithm || 'md5')
    .update(data, DEFAULT_ENCODING)
    .digest(encoding || 'hex');

export const checksumFile = (
  filePath: string,
  algorithm?: string,
  encoding?: any,
): Promise<string> =>
  new Promise((resolve, reject) => {
    const hash = crypto.createHash(algorithm || 'md5');
    const stream = fs.createReadStream(filePath);

    stream.on('error', (error) => {
      reject(error);
    });

    stream.on('data', (data: any) => {
      hash.update(data, DEFAULT_ENCODING);
    });

    stream.on('end', () => {
      resolve(hash.digest(encoding || 'hex'));
    });
  });

export const checksumFileSync = (
  filePath: string,
  algorithm?: string,
  encoding?: any,
): string => {
  const data = fs.readFileSync(filePath);
  const hash = checksum(data, algorithm, encoding);
  return hash;
};

export const copyFile = (src: string, dest: string): Promise<boolean> =>
  new Promise((resolve, reject) => {
    fs.copyFile(src, dest, (error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(true);
    });
  });

export const removeFile = (filePath: string, options?): Promise<boolean> =>
  new Promise((resolve, reject) => {
    rimraf(filePath, options || {}, (error?: Error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(true);
    });
  });

export const removeFileSync = (filePath: string, options?) =>
  rimraf.sync(filePath, options);

export const appendFile = (filePath: string, data): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const content = Buffer.from(data);
    fs.appendFile(
      filePath,
      content,
      { encoding: DEFAULT_ENCODING },
      (error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(true);
      },
    );
  });
};

export const readFileSync = (path: string, options?) =>
  fs.readFileSync(path, { encoding: DEFAULT_ENCODING, ...(options || {}) });

export const readFile = (filePath: string, options?): Promise<any> => {
  return new Promise((resolve, reject) => {
    fs.readFile(
      filePath,
      { encoding: DEFAULT_ENCODING, ...(options || {}) },
      (error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(true);
      },
    );
  });
};

export const existsSync = (path: string): boolean => fs.existsSync(path);

export const emptyDirSync = (path: string) => fs.emptyDirSync(path);

export const writeFileSync = (filePath: string, data, options?) =>
  fs.writeFileSync(filePath, Buffer.from(data), {
    encoding: DEFAULT_ENCODING,
    ...(options || {}),
  });

export const writeFile = (
  filePath: string,
  data,
  options?,
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const content = Buffer.from(data);
    fs.writeFile(
      filePath,
      content,
      { encoding: DEFAULT_ENCODING, ...(options || {}) },
      (error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(true);
      },
    );
  });
};

export const ensureDirSync = (path: string, options?: object | number) =>
  fs.ensureDirSync(path, options);

export const copySync = (
  sourcePath: string,
  destPath: string,
  options?: object,
) => fs.copySync(sourcePath, destPath, options);
