export default class Queue {
  dataBase: any[];
  constructor({ initData = [] }) {
    this.dataBase = initData;
  }
  push(item: any) {
    this.dataBase.push(item);
  }

  shift() {
    return this.dataBase.shift();
  }

  take(number: number) {
    return this.dataBase.splice(0, number);
  }
  get size() {
    return this.dataBase.length;
  }
}