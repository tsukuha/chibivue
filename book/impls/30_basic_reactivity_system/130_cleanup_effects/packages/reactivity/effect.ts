import { isArray } from "../shared";
import { Dep, createDep } from "./dep";

type KeyToDepMap = Map<any, Dep>;
const targetMap = new WeakMap<any, KeyToDepMap>();

export let activeEffect: ReactiveEffect | undefined;

export type EffectScheduler = (...args: any[]) => any;

export const ITERATE_KEY = Symbol();

export class ReactiveEffect<T = any> {
  active = true;
  parent: ReactiveEffect | undefined = undefined;

  private deferStop?: boolean;
  onStop?: () => void;

  constructor(
    public fn: () => T,
    public scheduler: EffectScheduler | null = null
  ) {}

  run() {
    if (!this.active) {
      return this.fn();
    }

    try {
      this.parent = activeEffect;
      activeEffect = this;
      const res = this.fn();
      return res;
    } finally {
      activeEffect = this.parent;
      this.parent = undefined;
      if (this.deferStop) {
        this.stop();
      }
    }
  }

  stop() {
    if (activeEffect === this) {
      this.deferStop = true;
    } else if (this.active) {
      if (this.onStop) {
        this.onStop();
      }
      this.active = false;
    }
  }
}

export function track(target: object, key: unknown) {
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }

  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, (dep = createDep()));
  }

  trackEffects(dep);
}

export function trackEffects(dep: Dep) {
  if (activeEffect) {
    dep.add(activeEffect);
  }
}

export function trigger(target: object, key?: unknown) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;

  const dep = depsMap.get(key);

  if (dep) {
    const effects = [...dep];
    triggerEffects(effects);
  }
}

export function triggerEffects(dep: Dep | ReactiveEffect[]) {
  const effects = isArray(dep) ? dep : [...dep];
  for (const effect of effects) {
    triggerEffect(effect);
  }
}

function triggerEffect(effect: ReactiveEffect) {
  if (effect.scheduler) {
    effect.scheduler();
  } else {
    effect.run();
  }
}

export function getDepFromReactive(object: any, key: string | number | symbol) {
  return targetMap.get(object)?.get(key);
}
