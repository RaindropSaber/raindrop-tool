import Queue from './Queue';
export default class SelfConsumeQueue {
  queue: Queue;
  consume: undefined | ((queue: Queue) => void);
  constructor({ initData = [] }) {
    this.queue = new Queue({ initData });
  }
  push(item: any) {
    this.queue.push(item);
    this.queue.size === 1 && this._trigger();
  }
  registerConsume(fn: (queue: Queue) => void) {
    this.consume = fn.bind(this);
  }
  _trigger() {
    if (!this.queue.size) return;
    setTimeout(async () => {
      this.consume && (await this.consume(this.queue));
      this._trigger();
    });
  }
};
