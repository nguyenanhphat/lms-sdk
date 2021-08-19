import * as webpack from 'webpack';
import { TargetType, LibraryTarget } from '../../const';

export const getJsonpFunctionName = (name: string, target?: TargetType) =>
  `webpackJsonp_${name}_${target || 'common'}_`;

export const getLibraryTarget = (target: TargetType): webpack.LibraryTarget =>
  target === TargetType.node ? LibraryTarget.commonjs2 : LibraryTarget.umd;

export const getGlobalObject = (target: TargetType): string =>
  (target === TargetType.sw && 'self') ||
  (target === TargetType.web ? 'window' : 'global');
