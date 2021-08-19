import { NEXT } from '../const';

export const formatRequest = request => {
  return NEXT + request.file;
};
