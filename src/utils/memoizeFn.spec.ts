import Sinon from 'sinon';

describe('Exported functions', () => {
  test('Exported default function', () => {
    const { default: memoizeFn } = require('./memoizeFn');
    expect(memoizeFn).toBeInstanceOf(Function);
  });
});

describe('Having full properties', () => {
  const { default: memoizeFn } = require('./memoizeFn');
  const spyFn = Sinon.spy();
  const memFn = memoizeFn(spyFn);
  test('Return a wrapped function', () => {
    expect(memFn).toBeInstanceOf(Function);
  });

  test('Having "flush" function', () => {
    expect(memFn.flush).toBeInstanceOf(Function);
  });

  test('Having "__cached" store', () => {
    expect(memFn.__cached).toBeInstanceOf(Map);
  });
});

describe('Workflow', () => {
  const { default: memoizeFn } = require('./memoizeFn');

  const add = (a: number, b: number): number => a + b;
  const spyAdd = Sinon.spy(add);
  const memoizeAdd = memoizeFn(spyAdd);

  const testCycleWorkflow = (times: number, sample: [number, number]) => {
    test(`#${times} Miss cached before execute`, () => {
      expect(memoizeAdd.__cached.size).toEqual(times - 1);
      expect(spyAdd.called).toEqual(times === 1 ? false : true);
    });

    test(`#${times} First execute and return result like original fn`, () => {
      expect(memoizeAdd(...sample)).toEqual(add(...sample));
      expect(spyAdd.callCount).toEqual(times);
    });

    test(`#${times} Having result in cached store`, () => {
      expect(memoizeAdd.__cached.size).toEqual(times);
    });

    test(`#${times} Next execute, using cached and not call original fn`, () => {
      expect(memoizeAdd(...sample)).toEqual(add(...sample));
      expect(spyAdd.callCount).toEqual(times);
    });

    test(`#${times} Checking cached store size`, () => {
      expect(memoizeAdd.__cached.size).toEqual(times);
    });
  };

  testCycleWorkflow(1, [1, 1]);
  testCycleWorkflow(2, [2, 2]);
  testCycleWorkflow(3, [1, 2]);

  test('Flush and cached store will empty', () => {
    memoizeAdd.flush();
    expect(memoizeAdd.__cached.size).toEqual(0);
    spyAdd.resetHistory();
  });

  testCycleWorkflow(1, [1, 1]);
});
