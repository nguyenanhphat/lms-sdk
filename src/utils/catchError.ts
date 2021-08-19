type Fn = (...rest: any[]) => any;

export const throwIfError = <T extends Fn>(wrappedFn: T): T =>
  function catchIfError() {
    try {
      return wrappedFn.apply(this, arguments);
    } catch (error) {
      throw error;
    }
  } as any;

export const logIfError = <T extends Fn>(wrappedFn: T): T =>
  function catchIfError() {
    try {
      return wrappedFn.apply(this, arguments);
    } catch (error) {
      console.log(error);
    }
  } as any;

export const silentIfError = <T extends Fn>(wrappedFn: T): T =>
  function catchIfError() {
    try {
      return wrappedFn.apply(this, arguments);
    } catch (error) {}
  } as any;
