import chalk from 'chalk';

let isNotifyBeforeExit = false;
function shouldBeNotifyBeforeExit() {
  if (isNotifyBeforeExit) {
    process.on('exit', () => {
      chalk.red(`There is a memory leak happening! Process id: ${process.pid}`);
    });
  }

  isNotifyBeforeExit = true;
}

export default shouldBeNotifyBeforeExit;
