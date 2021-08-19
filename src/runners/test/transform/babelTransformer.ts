import babelJest from 'babel-jest';
import getBabelConfig from '../getBabelConfig';

module.exports = babelJest.createTransformer(getBabelConfig());
