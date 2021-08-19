import fs from 'fs-extra';
import paths from '../paths';

export function saveBuildResult(stats) {
  fs.writeJson(paths.statsJSON, stats);
}
