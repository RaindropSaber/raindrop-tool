export const channelRun = (pFnArr: Function[] = [], channelNum = 1) => {
  const channels = new Array(channelNum).fill(Promise.resolve());
  const next = (ci) => {
    const pFn = pFnArr.shift();
    if (pFn) return (channels[ci] = pFn()?.then(() => next(ci)));
  };
  channels.forEach((channel, ci) => channel.then(next(ci)));
  return Promise.all(channels).then(() => {});
};

export default class ConcurrencyPromise {
  private readonly queue: (<T>() => Promise<T>)[] = [];
  private runChannels = 0;
  constructor(private freeChannels: number = 1) {}
  public get channels() {
    return this.runChannels + this.freeChannels;
  }
  private run() {
    if (this.freeChannels < 0) {
      this.runChannels--;
      this.freeChannels++;
      return;
    }
    const fn = this.queue.shift();
    if (fn) return fn().then(() => this.run());
    this.runChannels--;
    this.freeChannels++;
  }
  private trigger() {
    while (this.freeChannels > 0) {
      this.run();
      this.runChannels++;
      this.freeChannels--;
    }
  }
  public add(fn: <T>() => Promise<T>) {
    this.queue.push(fn);
    this.trigger();
    return this;
  }
  public addChannels(n: number) {
    this.freeChannels = this.freeChannels + n;
    this.trigger();
    return this;
  }
  public reduceChannels(n: number) {
    this.freeChannels = this.freeChannels - n;
    return this;
  }
  public stop() {
    return () => {};
  }
}

// const test = () => {
//   const sleep = (t) => new Promise((r) => setTimeout(r, t));
//   const log = (fn) => {
//     let getIndex = 1;
//     return (...arg) => {
//       const index = getIndex++;
//       console.log(`res${index} 开始`);
//       return fn(...arg).then((v) => {
//         console.log(`res${index} 结束`);
//         return v;
//       });
//     };
//   };
//   const testFn = log((v) =>
//     sleep(1000).then(() => {
//       console.log(v);
//     })
//   );
//   const concurrencyPromise = new ConcurrencyPromise();
//   setTimeout(() => {
//     concurrencyPromise.reduceChannels(1);
//     concurrencyPromise
//       .add(() => testFn(9))
//       .add(() => testFn(8))
//       .add(() => testFn(7));
//   }, 2000);

//   setTimeout(() => {
//     concurrencyPromise.addChannels(2);
//     console.log(`concurrencyPromise.channels`, concurrencyPromise.channels);
//   }, 4000);
//   concurrencyPromise
//     .add(() => testFn(1))
//     .add(() => testFn(2))
//     .add(() => testFn(3))
//     .add(() => testFn(4))
//     .add(() => testFn(5))
//     .add(() => testFn(6));
//   const testFnArr = new Array(10).fill(log(() => sleep(1000)));
//   channelRun(testFnArr, 2).then(() => console.log("the end"));
// };
// test();
