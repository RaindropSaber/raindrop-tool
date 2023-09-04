// 解决后发先至的 promise 问题

// 链式解决后发先至，按执行顺序返回，不是最快返回
export const lsfaPromiseSync = (pFn) => {
  let link = Promise.resolve();
  return (...arg) => {
    const res = pFn(...arg);
    link = link.then(() => res);
    return Promise.resolve().then(() => link);
  };
};

// 数组解决后发先至，按实际返回顺序返回，空间待优化
export const lsfaPromise = (pFn) => {
  const pA: any = [];
  let ri = 0;
  return (...arg) => {
    const i = pA.push(pFn(...arg)) - 1;
    return pA[i].then((v) => (ri > i ? pA[ri] : ((ri = i), v)));
  };
};

const test = async () => {
  const sleep = (t) => new Promise((r) => setTimeout(r, t));

  const log = (fn) => {
    let getIndex = 1;
    return (...arg) => {
      return fn(...arg).then((v) => {
        console.log(`res${getIndex++}`, v);
        return v;
      });
    };
  };
  const getData = log(lsfaPromise((t, res) => sleep(t).then((v) => res)));
  // 11
  // 33
  // 23
  // 44
  // 66
  // 56
  getData(1000, 1);
  getData(2000, 2);
  await getData(1500, 3);
  getData(1000, 4);
  getData(2000, 5);
  getData(1500, 6);
};

test();
