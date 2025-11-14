export class FakeGroup {
  children: any[] = [];
  handlers = new Map<string, ((e?: any) => void)[]>();
  config: any;

  constructor(config: any = {}) {
    this.config = config;
  }

  add(...nodes: any[]) {
    this.children.push(...nodes);
    return this;
  }

  on(event: string, handler: (e?: any) => void) {
    const arr = this.handlers.get(event) ?? [];
    arr.push(handler);
    this.handlers.set(event, arr);
    return this;
  }

  fire(event: string, evt?: any) {
    const handlers = this.handlers.get(event) ?? [];
    handlers.forEach((h) => h(evt));
  }

  visible(_v?: boolean) {
    return true;
  }

  getLayer() {
    return null;
  }
}

export class FakeRect {
  constructor(public config: any) {}
}

export class FakeText {
  constructor(public config: any) {}
  text() {
    return this.config.text;
  }
}

export class FakeArrow {
  constructor(public config: any) {}
}

export class FakeAnimation {
  cb: (frame: { time: number }) => void;
  layer: any;
  started = false;
  stopped = false;

  constructor(cb: (frame: { time: number }) => void, layer: any) {
    this.cb = cb;
    this.layer = layer;
  }

  start() {
    this.started = true;
  }

  stop() {
    this.stopped = true;
  }
}

export function createKonvaMock() {
  return {
    default: {
      Group: FakeGroup,
      Rect: FakeRect,
      Text: FakeText,
      Arrow: FakeArrow,
      Animation: FakeAnimation,
    },
  };
}
