import fs from 'fs';
import hashOf from './hashOf';

const appPath = fs.realpathSync(process.cwd());

export default (): string => hashOf(appPath, 8);
