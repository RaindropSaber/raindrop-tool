type T_JSON = null | string | boolean | number | T_JSON[] | { [key: string]: T_JSON };
const data = { a: 1, b: 'b', c: { d: { f: true, g: 'g', h: { i: 'i' } } }, e: null };
type Paths<T> = T extends object
  ? { [K in keyof T]: `${Exclude<K, symbol>}${'' | `.${Paths<T[K]>}`}` }[keyof T]
  : never;
type GET<O, P> = P extends `${infer K extends Exclude<keyof O, symbol>}.${infer C}`
  ? GET<O[K], C>
  : P extends Exclude<keyof O, symbol>
  ? O[P]
  : never;
const get = <O extends object, P, D>(
  o: O,
  p: P extends Paths<O> ? P : D extends undefined ? string:Paths<O> ,
  d?: D,
): P extends Paths<O> ? GET<O, P> : D => {
  return '' as unknown as P extends Paths<O> ? GET<O, P> : D;
};
const res1 = get(data, 'l');
const res = get(data, 'c.d', {});