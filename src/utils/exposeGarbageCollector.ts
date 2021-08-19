import v8 from 'v8';
import vm from 'vm';

export default function exposeGarbageCollector() {
  const isGarbageCollectorHidden = !global.gc;

  if (isGarbageCollectorHidden) {
    v8.setFlagsFromString('--expose-gc');
    global.gc = vm.runInNewContext('gc');
  }
}
