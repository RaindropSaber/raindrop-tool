export default class RecyclingMap<K, V> {
  dataBase: { [cycle: string]: Map<K, V> };
  size: number;
  cycle: number;
  lastCycle: number;
  keep: number;
  constructor({ cycle = 24 * 60 * 60 * 1000, keep = 3 } = {}) {
    this.dataBase = {}
    this.size = 0
    this.cycle = cycle
    this.keep = keep
  }

  set(key, value) {
    this.lastCycle = this.lastCycle || new Date().getTime()
    const now = new Date().getTime()
    if (now - this.lastCycle > this.cycle) {
      this.lastCycle = now
      const cycles = Object.keys(this.dataBase)
      if (cycles.length >= this.keep) {
        let needDelCycles = cycles.reduce((acc, v) => { return acc < v ? acc : v })
        delete this.dataBase[needDelCycles]
      }
    }
    if (!this.dataBase[this.lastCycle]) {
      this.lastCycle = this.lastCycle
      this.dataBase[this.lastCycle] = new Map()
    }
    const map = this.dataBase[this.lastCycle]
    this.size = this.size + 1
    return map.set(key, value)
  }

  get(key) {
    let cycle
    let value
    let res = !!Object.keys(this.dataBase).find((_cycle) => {
      if (this.dataBase[_cycle].has(key)) {
        cycle = _cycle
        value = this.dataBase[cycle].get(key)
        return true
      }
    })
    if (res) {
      this.delete(key)
      this.set(key, value)
    }
    return value
  }
  has(key) {
    return !!Object.keys(this.dataBase).find((cycle) => this.dataBase[cycle].has(key))
  }
  delete(key) {
    return !!Object.values(this.dataBase).find((map) => {
      if (map.has(key)) {
        map.delete(key)
        this.size = this.size - 1
        return true
      }
    })

  }

}