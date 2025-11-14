export class FakeNode {
  config: any;
  _visible = true;
  _x = 0;
  _y = 0;

  constructor(config: any = {}) {
    this.config = config;
    if (typeof config.x === "number") this._x = config.x;
    if (typeof config.y === "number") this._y = config.y;
  }

  hide() {
    this._visible = false;
  }

  show() {
    this._visible = true;
  }

  visible(v?: boolean) {
    if (typeof v === "boolean") this._visible = v;
    return this._visible;
  }

  position(pos?: { x: number; y: number }) {
    if (pos) {
      this._x = pos.x;
      this._y = pos.y;
    }
    return { x: this._x, y: this._y };
  }

  x(v?: number) {
    if (typeof v === "number") this._x = v;
    return this._x;
  }

  y(v?: number) {
    if (typeof v === "number") this._y = v;
    return this._y;
  }
}

export class FakeGroup {
  children: any[] = [];
  handlers = new Map<string, ((e?: any) => void)[]>();
  config: any;
  _visible = true;

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

  hide() {
    this._visible = false;
  }

  show() {
    this._visible = true;
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

export class FakeLine {
  constructor(public config: any) {}
}

export class FakeImage {
  config: any;
  _width = 0;
  _height = 0;
  _x = 0;
  _y = 0;

  constructor(config: any = {}) {
    this.config = config;
  }

  width(v?: number) {
    if (typeof v === "number") this._width = v;
    return this._width;
  }

  height(v?: number) {
    if (typeof v === "number") this._height = v;
    return this._height;
  }

  x(v?: number) {
    if (typeof v === "number") this._x = v;
    return this._x;
  }

  y(v?: number) {
    if (typeof v === "number") this._y = v;
    return this._y;
  }

  static fromURL(_url: string, cb: (img: FakeImage) => void) {
    const img = new FakeImage();
    cb(img);
  }
}

export class FakeCircle extends FakeNode {}

export class FakeAnimation {
  static instances: FakeAnimation[] = [];

  cb: (frame: { time: number }) => void;
  layer: any;
  started = false;
  stopped = false;

  constructor(cb: (frame: { time: number }) => void, layer: any) {
    this.cb = cb;
    this.layer = layer;
    FakeAnimation.instances.push(this);
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
      Line: FakeLine,
      Animation: FakeAnimation,
      Image: FakeImage,
      Circle: FakeCircle,
    },
  };
}
