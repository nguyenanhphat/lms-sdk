import { TargetType } from '../../const';

export default function getTargetConfig(target: TargetType) {
  if (target === TargetType.node) {
    return 'node';
  }
  return 'web';
}
