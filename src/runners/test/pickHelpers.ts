import _pickBy from 'lodash/pickBy';
import { HelpersType } from '../../interfaces/testRunner.interface';

const pickHelpers = (helpers: HelpersType | null): HelpersType =>
  _pickBy(helpers, helper => typeof helper === 'function');

export default pickHelpers;
