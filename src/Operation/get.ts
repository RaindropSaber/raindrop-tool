type T_JSON =
  | null
  | string
  | boolean
  | number
  | T_JSON[]
  | { [key: string]: T_JSON };
const data = {
  a: 1,
  b: "b",
  c: { d: { f: true, g: "g", h: { i: "i" } } },
  e: [{ l: ["k"] }, { l2: ["k"] }],
};
type Paths<T> = T extends object
  ? T extends Array<infer A>
    ? {
        [K in Extract<keyof T, Number>]: `${Exclude<K, symbol>}${
          | ""
          | `.${Paths<A>}`}`;
      }[Extract<keyof T, Number>]
    : {
        [K in keyof T]: `${Exclude<K, symbol>}${"" | `.${Paths<T[K]>}`}`;
      }[keyof T]
  : never;

type Paths2<T> = T extends object
  ? T extends Array<infer A>
    ? {
        [K in GetIntegerUnion<T["length"]>]: `${Exclude<K, symbol>}${
          | ""
          | `.${Paths<T[K]>}`}`;
      }[GetIntegerUnion<T["length"]>]
    : {
        [K in keyof T]: `${Exclude<K, symbol>}${"" | `.${Paths<T[K]>}`}`;
      }[keyof T]
  : never;

type GET<O, P> = P extends `${infer K extends Exclude<
  keyof O,
  symbol
>}.${infer C}`
  ? GET<O[K], C>
  : P extends Exclude<keyof O, symbol>
  ? O[P]
  : never;
const get = <O extends object, P, D>(
  o: O,
  p: P extends Paths<O> ? P : D extends unknown ? Paths<O> : string,
  d?: D
): P extends Paths<O> ? GET<O, P> : D => {
  return "" as unknown as P extends Paths<O> ? GET<O, P> : D;
};
type sd = Paths2<{
  a: 1;
  b: "b";
  c: { d: { f: true; g: "g"; h: { i: "i" } } };
  e: { l: ["k"] }[];
  n: [{ m: ["m1"] }, { m2: ["m2"] }];
}>;
const res1 = get(data, "e.1.v");
const res = get(data, "c.d", {});

type GetIntegerUnion<
  N extends number,
  R extends number = 0,
  Arr extends any[] = []
> = Arr["length"] extends N
  ? R
  : GetIntegerUnion<N, R | Arr["length"], [any, ...Arr]>;

type AASSSS = GetIntegerUnion<3>;
type fff2 = {
  [k in AASSSS]: 123;
};
//  type AASSSS = (0 | 1 | 2)[]
