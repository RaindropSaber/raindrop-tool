
class FixedSizeMap<K, V> extends Map<K, V> {
  fixedSize: number;
  constructor(fixedSize: number) {
    super()
    this.fixedSize = fixedSize
  }
  set(key, value): any | this | boolean {
    if (super.size === this.fixedSize) return false
    return super.set(key, value)
  }
}

export default class MaxSizeMap<K, V> {
  dataBase: Array<FixedSizeMap<K, V>>;
  maxSize: number;
  sliceSize: number;
  size: number;
  constructor({ maxSize = 100, sliceSize = 30 }) {
    this.maxSize = maxSize
    this.sliceSize = sliceSize
    this.dataBase = []
    this.size = 0
  }
  set(key, value) {
    this.delete(key)
    while (this.size === this.maxSize) {
      this.size = this.size - (this.dataBase.shift() as FixedSizeMap<K, V>).size
    }
    const dateSegment = this.dataBase[this.dataBase.length - 1]
    if (!dateSegment || dateSegment.set(key, value) === false) {
      this.dataBase.push(new FixedSizeMap(this.sliceSize).set(key, value))
    }
    this.size = this.size + 1
  }
  get(key) {
    let value: V | undefined = undefined
    this.dataBase.find((dateSegment) => {
      value = dateSegment.get(key)
      return value
    })
    return value
  }
  has(key) {
    return !!this.dataBase.find((dateSegment) => {
      return dateSegment.has(key)
    })
  }
  delete(key) {
    return !!this.dataBase.find((dateSegment) => {
      if (dateSegment.has(key)) {
        dateSegment.delete(key)
        this.size = this.size - 1
        return true
      }
    })
  }

}