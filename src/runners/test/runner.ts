import runner from 'jest-jasmine2';

function overrideRunner() {
  const [, , environment, runtime] = arguments;

  const prepareIsFunction = typeof environment.prepare === 'function';
  if (prepareIsFunction) {
    environment.prepare(runtime);
  }

  return runner.apply(this, arguments);
}

module.exports = overrideRunner;
