import chalk from 'chalk';
import { CIRCLE_OPEN, CROSS, TICK } from '../../const';
import { formatRequest } from '../formatWebpackRequest';
import { LogUpdate } from '../logUpdate';
import { trimmedString } from '../trimmedString';
import { colorize, ellipsisLeft, renderBar } from './renderTableHelpers';

let lastRender = Date.now();
const logUpdate = new LogUpdate();

const reportedMessage = {};
const spinerData = {
  interval: 1,
  frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
  frameIndex: 0,
  current: 0,
};

function getSpiner() {
  if (spinerData.current > spinerData.interval) {
    spinerData.current = 0;
    spinerData.frameIndex += 1;
    if (spinerData.frameIndex === spinerData.frames.length) {
      spinerData.frameIndex = 0;
    }
  }
  spinerData.current += 1;
  return spinerData.frames[spinerData.frameIndex];
}

class WebpackReporter {
  currentStep = 0;
  lines = [];
  steps = [];

  afterAllDone(context) {
    this.lines = [];
    this.reportStep('finished!!');
    this.render();
  }

  getStep(step: number, max: number) {
    return chalk.bold.dim.white(`[step:${step < 10 ? 0 : ''}${step}]`);
  }

  handleProgressChange = (state) => {
    const color = colorize(state.color);
    if (state.progress >= 0 && state.progress < 100) {
      this.reportStep(state.message);

      this.lines = [
        [
          chalk.bold.whiteBright(`${getSpiner()}`),
          trimmedString(state.details[0] || '', logUpdate.columns - 3).padStart(
            logUpdate.columns - 3,
          ),
        ].join(''),
        renderBar(state.progress, state.color, logUpdate.columns),
        state.request &&
          [
            chalk.dim.white(
              ellipsisLeft(formatRequest(state.request), logUpdate.columns),
            ),
          ].join(' '),
        ' ',
        ' ',
      ].filter(Boolean);
      if (process.env.CI) {
        if (state.request.file && !reportedMessage[state.request.file]) {
          reportedMessage[state.request.file] = true;
          console.log(
            ellipsisLeft(formatRequest(state.request), logUpdate.columns),
          );
        }
      }
    } else {
      let icon = ' ';
      if (state.hasErrors) {
        icon = CROSS;
      } else if (state.progress === 100) {
        icon = TICK;
      } else if (state.progress === -1) {
        icon = CIRCLE_OPEN;
      }
      this.reportStep(
        [color(`${icon} ${state.name}`), chalk.grey('  ' + state.message)].join(
          '',
        ),
      );
    }
  };
  progress = (context) => {
    if (Date.now() - lastRender > 50) {
      lastRender = Date.now();

      context.statesArray.forEach(this.handleProgressChange);

      this.render();
    }
  };

  render() {
    if (!process.env.CI) {
      logUpdate.render([...this.steps, ...this.lines].join('\n'));
    }
  }

  reportStep = (stepName) => {
    if (!reportedMessage[stepName]) {
      reportedMessage[stepName] = true;
      this.currentStep += 1;
      if (process.env.CI) {
        console.log(
          `${this.getStep(this.currentStep, 18)} ${chalk.white(stepName)}`,
        );
      } else {
        this.steps.push(
          `${this.getStep(this.currentStep, 18)} ${chalk.white(stepName)}`,
        );
      }
    }
  };

  start = (context) => {
    this.reportStep('setting up');
    this.render();
  };
}

export default WebpackReporter;
