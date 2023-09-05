const chainRun = (pFnArr: Function[] = [], index = 1) => {
  const chains = new Array(index).fill(Promise.resolve());
  const next = (ci) => {
    const pFn = pFnArr.shift();
    if (pFn) return (chains[ci] = pFn()?.then(() => next(ci)));
  };
  chains.forEach((chain, ci) => chain.then(next(ci)));
  return Promise.all(chains).then(() => {});
};

class ChainsPromise {
  status = "";
  queue: (<T>() => Promise<T>)[] = [];
  runChains = 0;
  freeChains = 1;

  get chains() {
    return this.runChains + this.freeChains;
  }
  #run() {
    if (this.freeChains < 0) {
      this.runChains--;
      this.freeChains++;
      return;
    }
    const fn = this.queue.shift();
    if (fn) return fn().then(() => this.#run());
    this.runChains--;
    this.freeChains++;
  }
  #trigger() {
    while (this.freeChains > 0) {
      this.#run();
      this.runChains++;
      this.freeChains--;
    }
  }
  add(fn: <T>() => Promise<T>) {
    this.queue.push(fn);
    this.#trigger();
    return this;
  }
  addChains(n: number) {
    this.freeChains = this.freeChains + n;
    this.#trigger();
    return this;
  }
  reduceChains(n: number) {
    this.freeChains = this.freeChains - n;
    return this;
  }
  stop() {
    return () => {};
  }
}

const main = () => {
  const sleep = (t) => new Promise((r) => setTimeout(r, t));
  const log = (fn) => {
    let getIndex = 1;
    return (...arg) => {
      const index = getIndex++;
      console.log(`res${index} 开始`);
      return fn(...arg).then((v) => {
        console.log(`res${index} 结束`);
        return v;
      });
    };
  };
  const testFn = log(() => sleep(1000));
  const chainsPromise = new ChainsPromise();
  setTimeout(() => {
    chainsPromise.reduceChains(1);
    chainsPromise
      .add(testFn)
      .add(testFn)
      .add(testFn)
      .add(testFn)
      .add(testFn)
      .add(testFn)
      .add(testFn);
  }, 1000);

  setTimeout(() => {
    chainsPromise.addChains(1);
    setTimeout(() => {
      chainsPromise.addChains(1);
    }, 3000);
  }, 3000);
  chainsPromise
    .add(testFn)
    .add(testFn)
    .add(testFn)
    .add(testFn)
    .add(testFn)
    .add(testFn)
    .add(testFn);
  // const testFn = new Array(10).fill(log(() => sleep(1000)));
  // chainRun(testFn, 2).then(() => console.log("the end"));
};
main();
