import _transform from 'lodash/transform';

const filterReg = /(^STATIC_|^APP_|^BUILD_TOOL_|^PUBLIC_URL|^PLATFORM)/i;

export default (env?: NodeJS.Process['env']) =>
  Object.assign(
    _transform(
      env || process.env,
      (r, v, k) => {
        if (filterReg.test(k)) {
          if (k.includes('STATIC')) {
            r[k] = v === 'true' ? true : v;
          } else if (k.includes('ENABLE')) {
            r['process.env.' + k] = v === 'true' || v === '1' ? true : false;
            r[k] = v === 'true' || v === '1' ? true : false;
          } else {
            r['process.env.' + k] = JSON.stringify(v === 'true' ? true : v);
            r[k] = v === 'true' ? true : v;
          }
        }
      },
    ),
    {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    },
  );
