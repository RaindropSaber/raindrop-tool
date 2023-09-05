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
  chains = [Promise.resolve()];
  end = () => {};
  #createChain() {
    let r;
    const p = new Promise((resolve) => (r = resolve));
    return [p, r];
  }
  run() {
    const next = (ci) => {
      const fn = this.queue.shift();
      if (fn) return (this.chains[ci] = fn().then(() => next(ci)));
    };
    this.chains.forEach((chain, ci) => chain.then(next(ci)));
    Promise.all(this.chains).then(this.end);
    return this;
  }
  addPromise(fn: <T>() => Promise<T>) {
    this.queue.push(fn);
    return this;
  }
  addChain(n: number) {
    return this;
  }
  stop() {
    return this;
  }
  onEnd(fn) {
    this.end = fn;
    return this;
  }
  onChange() {
    return this;
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
  chainsPromise
    .addPromise(testFn)
    .onEnd(() => {
      console.log("the end");
    })
    .run()
    .addPromise(testFn)
    .addPromise(testFn)
    .addPromise(testFn)
    .addPromise(testFn);
  // const testFn = new Array(10).fill(log(() => sleep(1000)));
  // chainRun(testFn, 2).then(() => console.log("the end"));
};
main();
