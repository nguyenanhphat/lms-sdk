import runGarbageCollector from './runGarbageCollector';

class ProcessLeaksDetector {
  constructor(limit: number) {
    this.limit = limit;
    this.stats = [];
  }

  private limit: number;
  private stats: number[];

  public snapshot = (shouldCleanBefore: boolean = true) => {
    if (shouldCleanBefore) {
      runGarbageCollector();
    }

    this.prepare();

    const isLeaking = this.checkIsLeaking();
    return isLeaking;
  }

  private readonly checkIsLeaking = () => {
    let upTimes = 0;

    const length = this.stats.length;
    for (let i = length; i > 0; i--) {
      const currentValue = this.stats[i];
      const olderValue = this.stats[i - 1];
      if (currentValue > olderValue) {
        upTimes++;
      }

      if (upTimes === this.limit) {
        break;
      }
    }

    return upTimes === this.limit;
  }

  private readonly prepare = () => {
    const shouldPop = this.stats.length === this.limit + 1;
    if (shouldPop) {
      this.stats.pop();
    }

    const heapUsed = process.memoryUsage().heapUsed;
    this.stats.push(heapUsed);
  }
}

export default ProcessLeaksDetector;
