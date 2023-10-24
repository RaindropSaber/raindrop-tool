/* eslint-disable no-unused-expressions */
/* eslint-disable no-plusplus */
/* eslint-disable no-return-assign */

const DEFAULT_INTERVAL = 5 // 默认轮询时间
const DEFAULT_MAX_COUNT = Infinity // 默认轮询次数

// 将 异步函数 变为可被轮询的结构体的高阶函数,使用方式参考下方的注释
const polling = <T extends (...arg: any[]) => Promise<any>>(
  fn: T,
  opt: { maxCount?: number; interval?: number } = {},
) => {
  const sleep = (t = 1) => new Promise(r => setTimeout(r, t * 1000))
  let options = { interval: DEFAULT_INTERVAL, maxCount: DEFAULT_MAX_COUNT, ...opt }
  let callback: ((res: Awaited<ReturnType<T>>, count: number) => void) | null = null
  let isStop = true
  let count = 1
  return {
    start: (...arg: Parameters<T>) => {
      if (!isStop) return
      isStop = false
      const run:()=>void = () => !isStop
        && count < options.maxCount
        && fn(...arg)
          .then((res: Awaited<ReturnType<T>>) => callback?.(res, count++))
          .then(() => sleep(options.interval))
          .then(() => run())
      run()
    },
    on: (cb: (res: Awaited<ReturnType<T>>, count: number) => void) => (callback = cb),
    stop: () => (isStop = true),
    setOptions: (_opt:{ maxCount?: number; interval?: number } = {}) => {
      options = {
        ..._opt,
        ...options,
      }
    },
    isRunning: () => !isStop,
  }
}

export default polling

// const testQueryFn = async (str: string) => {
//   const sleep = (t = 1) => new Promise(r => setTimeout(r, t * 1000))
//   await sleep(1)
//   const res = Math.random()
//   console.log('polling:', str, res)
//   return res
// }
// const test = async () => {
//   const pollingFn = polling(testQueryFn, { interval: 1 })
//   pollingFn.start('test')
//   pollingFn.on(v => {
//     if (v > 0.9) pollingFn.stop()
//   })
// }

// test()
