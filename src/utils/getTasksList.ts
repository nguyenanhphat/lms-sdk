import Task from '../tasks/tasks';
import BuildBrowserTask from '../tasks/buildBrowser';
import BuildServiceWorkerTask from '../tasks/buildServiceWorker';
import BuildNodeTask from '../tasks/buildNode';
import DevBrowserTask from '../tasks/devBrowser';
import TestBrowserTask from '../tasks/testBrowser';
import { TargetType, ModeType } from '../const';

const tasks = [
  BuildBrowserTask,
  BuildNodeTask,
  BuildServiceWorkerTask,
  DevBrowserTask,
  TestBrowserTask,
].filter(Boolean);

export const findTask = (target: TargetType, mode: ModeType) =>
  tasks.find(t => t.mode === mode && t.target === target);

export default () => tasks;
