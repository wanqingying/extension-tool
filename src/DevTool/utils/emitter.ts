// event emitter

export class EventEmitter {
  private events: { [key: string]: Function[] } = {};
  // uid
  static px = 1;
  private eid = EventEmitter.px++;

  on(event: string, listener: Function) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  addListener(event: string, listener: Function) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
    console.log(`addListener ${event} ${this.eid} `, this.events[event]);
  }

  emit(event: string, ...args: any[]) {
    console.log(`emit ${event} ${this.eid} ` + this.eid, this.events[event]);
    if (this.events[event]) {
      this.events[event].forEach((listener) => listener(...args));
    }
  }
}

export const devEmitter = new EventEmitter();
