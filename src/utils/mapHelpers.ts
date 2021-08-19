export const toObject = (coll: Map<any, any>): object => {
  const object = {};
  coll.forEach((value, key) => {
    object[key] = value;
  });

  return object;
};

type TransformFn = (object: object) => object;

export const toJson = (coll: Map<any, any>, transform?: TransformFn): string => {
  let object = toObject(coll);
  if (transform) {
    object = transform(object);
  }

  return JSON.stringify(object);
};
