import { getCurrentInstance, inject, InjectionKey, provide, reactive } from 'vue';

// based on https://medium.com/@mario.brendel1990/vue-3-the-new-store-a7569d4a546f

export abstract class ComponentContext<T extends Record<string, unknown>> {
  protected iState: T;

  // the readonly state should be enabled when we switch to Vue 3
  // readonly #readOnlyState: T;

  constructor() {
    this.iState = reactive(this.data()) as T;
    // enabling with Vue 3
    // this.#readOnlyState = readonly(this._state) as T;
  }

  protected abstract data(): T;

  get state(): T {
    return this.iState;
    // enabling with Vue 3
    // return this.#readOnlyState;
  }
}

export function getContextSymbol<T>(description: string): InjectionKey<T> {
  return Symbol.for(`SimpleContext_${description}`);
}

export function contextFactory<T extends ComponentContext<Record<string, unknown>>>(key: string, factory: () => T): T {
  const storeKey = getContextSymbol<T>(key);
  return inject(
    storeKey,
    () => {
      const instance = getCurrentInstance();
      if (instance == null) {
        throw Error(`contextFactory() for ${key} must be used within an composition setup method`);
      }
      const s = factory();
      provide(storeKey, s);
      return s;
    },
    true
  );
}
