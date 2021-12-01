
class FixedSizeSet<T> extends Set<T> {
  fixedSize: number;
  constructor(fixedSize: number) {
    super()
    this.fixedSize = fixedSize
  }
  add(value): any | this | boolean {
    if (this.size === this.fixedSize) return false
    return super.add(value)
  }
}

export default class MaxSizeSet<T> {
  dataBase: Array<FixedSizeSet<T>>;
  maxSize: number;
  sliceSize: number;
  size: number;
  constructor({ maxSize, sliceSize }) {
    this.maxSize = maxSize
    this.sliceSize = sliceSize
    this.dataBase = []
    this.size = 0
  }
  add(value) {
    this.delete(value)
    while (this.size === this.maxSize) {
      this.size = this.size - (this.dataBase.shift() as FixedSizeSet<T>).size
    }
    const dateSegment = this.dataBase[this.dataBase.length - 1]
    if (!dateSegment || dateSegment.add(value) === false) {
      this.dataBase.push(new FixedSizeSet(this.sliceSize).add(value))
    }
    this.size = this.size + 1
  }
  has(value) {
    return !!this.dataBase.find((dateSegment) => {
      return dateSegment.has(value)
    })
  }
  delete(value) {
    return !!this.dataBase.find((dateSegment) => {
      if (dateSegment.has(value)) {
        dateSegment.delete(value)
        this.size = this.size - 1
        return true
      }
    })
  }

}