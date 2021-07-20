export interface Immutable<Class> {
  clone(): Class;
}

function isImmutable<T>(data: unknown): data is Immutable<T> {
  return typeof data === "object" && data !== null && "clone" in data;
}

export function clone<T>(data: Immutable<T>): T;
export function clone<T>(data: T): T;
export function clone(data: any) {
  if (isImmutable(data)) return data.clone();
  return JSON.parse(JSON.stringify(data));
}

export function immutableMethod<
  X,
  This extends Immutable<X>,
  Args extends any[],
  R
>(method: (this: X, ...args: Args) => R) {
  return function (this: This, ...args: Args): This {
    method.apply(this.clone(), args);
    return this
  };
}
