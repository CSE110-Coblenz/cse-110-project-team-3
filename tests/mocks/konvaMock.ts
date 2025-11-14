// A fake layer that has `draw` and `batchDraw` methods
class FakeLayer {
  draw() {}
  batchDraw() {}
}
const FAKE_LAYER = new FakeLayer();

export class FakeNode {
  config: any;
  _visible = true;
  _x = 0;
  _y = 0;
  _attrs: Record<string, any> = {};
  parent: FakeGroup | null = null;
  // Store event handlers
  handlers = new Map<string, ((e?: any) => void)[]>();

  constructor(config: any = {}) {
    this.config = config;
    if (typeof config.x === "number") this._x = config.x;
    if (typeof config.y === "number") this._y = config.y;
    this._attrs = { ...config };
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

  getLayer() {
    // Return a fake layer so that `getLayer()?.draw()` doesn't crash.
    return FAKE_LAYER;
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

  setAttr(key: string, value: any) {
    this._attrs[key] = value;
  }

  getAttr(key: string) {
    return this._attrs[key];
  }

  listening(val?: boolean) {
    if (val !== undefined) this.setAttr("listening", val);
    return this.getAttr("listening") ?? true;
  }

  opacity(val?: number) {
    if (val !== undefined) this.setAttr("opacity", val);
    return this.getAttr("opacity") ?? 1;
  }

  offsetX(val?: number) {
    if (val !== undefined) this.setAttr("offsetX", val);
    return this.getAttr("offsetX") ?? 0;
  }

  offsetY(val?: number) {
    if (val !== undefined) this.setAttr("offsetY", val);
    return this.getAttr("offsetY") ?? 0;
  }

  width() {
    return this.config.width ?? 0;
  }

  height() {
    return this.config.height ?? 0;
  }

  destroy() {
    this.remove();
  }

  remove() {
    if (this.parent) {
      const i = this.parent.children.indexOf(this);
      if (i > -1) this.parent.children.splice(i, 1);
    }
  }
}

export class FakeGroup extends FakeNode {
  children: FakeNode[] = [];

  add(...nodes: FakeNode[]) {
    nodes.forEach((n) => {
      n.parent = this;
      this.children.push(n);
    });
    return this;
  }

  findOne<T extends FakeNode>(selector: string): T | undefined {
    // Super simple selector, just matches class name.
    // e.g., ".Rect" or "Rect"
    const s = selector.startsWith(".") ? selector.substring(1) : selector;

    for (const child of this.children) {
      if (child.constructor.name === `Fake${s}`) return child as T;
      if (child instanceof FakeGroup) {
        const found = child.findOne<T>(selector);
        if (found) return found;
      }
    }
    return undefined;
  }

  getClientRect() {
    // We just need *something* with a height; tests don't assert the value.
    return {
      x: this._x,
      y: this._y,
      width: this.config?.width ?? 0,
      height: this.config?.height ?? 80, // arbitrary non-zero height
    };
  }
}

export class FakeRect extends FakeNode {
  fill(val?: string) {
    if (val !== undefined) this.setAttr("fill", val);
    return this.getAttr("fill");
  }
  shadowEnabled(val?: boolean) {
    if (val !== undefined) this.setAttr("shadowEnabled", val);
    return this.getAttr("shadowEnabled");
  }
  shadowBlur(val?: number) {
    if (val !== undefined) this.setAttr("shadowBlur", val);
    return this.getAttr("shadowBlur");
  }
  shadowColor(val?: string) {
    if (val !== undefined) this.setAttr("shadowColor", val);
    return this.getAttr("shadowColor");
  }
  shadowOpacity(val?: number) {
    if (val !== undefined) this.setAttr("shadowOpacity", val);
    return this.getAttr("shadowOpacity");
  }
}

export class FakeText extends FakeNode {
  text() {
    return this.config.text;
  }
}

export class FakeArrow extends FakeNode {}

export class FakeLine extends FakeNode {}

export class FakeImage extends FakeNode {
  static fromURL(_url: string, cb: (img: FakeImage) => void) {
    const img = new FakeImage();
    // In tests, we don't need to wait for an image to load.
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
  // Before creating a new mock, clear any old animation instances
  FakeAnimation.instances = [];

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