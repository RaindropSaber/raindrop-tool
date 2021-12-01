module.exports = function (fnList) {
  return function (ctx) {
    const dispatch = (index) => {
      let fn = fnList[index]
      if (index === fnList.length || !fn) return Promise.resolve()
      index = index+1
      return Promise.resolve(fn(ctx,()=>dispatch(index)))
    }
    return dispatch(0)
  }
}

let sleep = (t) => new Promise((r)=>setTimeout(r,t))

let start = module.exports([
  async (ctx, next) => {
    ctx.kk = '1'
    console.log(ctx);
    next()
    ctx.kk = '4'
    console.log(ctx);
  },
  async (ctx, next) => {
    ctx.kk = '2'
    console.log(ctx);
    await sleep(300)
    next()
    ctx.kk = '3'
    console.log(ctx);

  },
])

let ctx  = { dd: '123' }
start(ctx)
console.log(ctx)