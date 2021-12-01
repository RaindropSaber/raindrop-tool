const { SelfConsumQueue, MaxSizeSet, MaxSizeMap,RecyclingMap } = require('../lib');

const sleep = (t = 1000) => new Promise((r) => setTimeout(r, t));

function testSelfConsumQueue() {
  const queue = new SelfConsumQueue({});
  queue.registerConsume(async (q) => {
    const item = q.take(5);
    await sleep(2000);
    let res = await Promise.all(item);
  });
  // queue.push(1);
  // queue.push(2);
  // queue.push(3);
  // setTimeout(() => {
  //   queue.push(7);
  //   queue.push(8);
  //   queue.push(9);
  // }, 7000);
  // queue.push(4);
  // queue.push(5);
  // queue.push(6);

  let index = 0;
  let P = (p) =>
    new Promise((r) => {
      r(p);
    });
  let interval = setInterval(() => {
    new Array(7).fill(0).forEach(() => {
      queue.push(P(index++));
      index === 100 && clearInterval(interval);
    });
  }, Math.random() * 1000);
}

function testMaxSizeSet() {
  let set = new MaxSizeSet({ maxSize: 100, sliceSize: 30 });
  let a = 0;
  while (a <= 107) {
    set.add(a);
    a++;
  }
  a = 0;
  while (a <= 50) {
    set.delete(a + 50);
    a++;
  }
  a = 0;
  console.log(set);

  while (a <= 20) {
    set.add(a + 35);
    a++;
  }
  a = 0;
  while (a <= 107) {
    set.add(a);
    a++;
  }
  a = 0;

  console.log(set);

  set.add('123');
  set.add('123');
  set.add('124');
  set.add('125');
  console.log(set);
}

function testMaxSizeMap() {
  let map = new MaxSizeMap({ maxSize: 100, sliceSize: 30 });
  let a = 0;
  while (a <= 110) {
    map.set(a,a);
    a++;
  }
  a = 0;
  while (a <= 30) {
    map.delete(a + 50);
    a++;
  }
  a = 0;
  while (a <= 40) {
    map.set(a+50,a+50);
    a++;
  }
  // a = 0;
  console.log(map);
  console.log('ddd',map.get(40));
  map.get(40)


}

async function testRecyclingMap() {
  let map = new RecyclingMap({ cycle: 3 * 1000, keep: 3 })
  map.set('a', 'a')
  await sleep(1000)
  map.set('b', 'b')
  await sleep(3000)
  map.set('c', 'c')
  await sleep(500)
  map.set('d', 'd')
  await sleep(3000)
  map.set('e', 'e')
  console.log(`map.get('a')`,map.get('a'))
  await sleep(3000)
  map.set('c', 'c2')
  map.set('a', 'a')
  console.log(`map.get('b')`,map.get('b'))
  await sleep(6000)
  map.set('f', 'f')









  console.log(`map`,map)

}
testRecyclingMap()
// testMaxSizeMap()