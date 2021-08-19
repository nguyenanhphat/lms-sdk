import v8 from 'v8';
import vm from 'vm';

export default function runGarbageCollector() {
  const isGarbageCollectorHidden = !global.gc;

  v8.setFlagsFromString('--expose-gc');
  vm.runInNewContext('gc')();

  if (isGarbageCollectorHidden) {
    v8.setFlagsFromString('--no-expose-gc');
  }
}
