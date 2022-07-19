import {
  FunctionalComponentMountOptions, FunctionalComponentShallowMountOptions,
  mount,
  MountOptions, shallowMount, ShallowMountOptions,
  ThisTypedMountOptions, ThisTypedShallowMountOptions,
  VueClass,
  Wrapper
} from '@vue/test-utils';
import Vue, { ComponentOptions, FunctionalComponentOptions } from 'vue';
import { CombinedVueInstance, ExtendedVue } from 'vue/types/vue';
import { DefaultProps, PropsDefinition } from 'vue/types/options';
import { testVue } from './easyLocalVue';


// this reflect the mount() definitions @vue/test-utils
// yes, ts show two errors show, but these are the same as in @vue/test-utils
// but the point is, that it works in vue 2.7.6 and runs in a stack overflow with 2.7.7

// @ts-ignore
async function easyMount<V extends Vue>(component: VueClass<V>, options?: ThisTypedMountOptions<V>): Promise<Wrapper<V>>
async function easyMount<V extends Vue>(component: ComponentOptions<V>, options?: ThisTypedMountOptions<V>): Promise<Wrapper<V>>
// @ts-ignore
async function easyMount<V extends Vue, Data, Methods, Computed, Props>(component: ExtendedVue<V, Data, Methods, Computed, Props>, options?: ThisTypedMountOptions<V>): Promise<Wrapper<CombinedVueInstance<V, Data, Methods, Computed, Props> & Vue>>
async function easyMount<Props = DefaultProps, PropDefs = PropsDefinition<Props>>(component: FunctionalComponentOptions<Props, PropDefs>, options?: MountOptions<Vue>): Promise<Wrapper<Vue>>
async function easyMount<V extends Vue, Props = DefaultProps>(component: ExtendedVue<V, {}, {}, {}, Props, {}>, options?: FunctionalComponentMountOptions<V>): Promise<Wrapper<CombinedVueInstance<V, {}, {}, {}, Props, {}> & Vue>> {

  options = options ?? {};
  if (!options.localVue) {
    options.localVue = testVue;
  }
  const wrapper = mount(component, options);
  if (wrapper.vm) {
    await wrapper.vm.$nextTick();
  }
  return wrapper;
}

// @ts-ignore
async function easyShallowMount<V extends Vue>(component: VueClass<V>, options?: ThisTypedShallowMountOptions<V>): Promise<Wrapper<V>>
async function easyShallowMount<V extends Vue>(component: ComponentOptions<V>, options?: ThisTypedShallowMountOptions<V>): Promise<Wrapper<V>>
// @ts-ignore
async function easyShallowMount<V extends Vue, Data, Methods, Computed, Props>(component: ExtendedVue<V, Data, Methods, Computed, Props>, options?: ThisTypedShallowMountOptions<V>): Promise<Wrapper<CombinedVueInstance<V, Data, Methods, Computed, Props> & Vue>>
async function easyShallowMount<Props = DefaultProps, PropDefs = PropsDefinition<Props>>(component: FunctionalComponentOptions<Props, PropDefs>, options?: ShallowMountOptions<Vue>): Promise<Wrapper<Vue>>
async function easyShallowMount<V extends Vue, Props = DefaultProps>(component: ExtendedVue<V, {}, {}, {}, Props, {}>, options?: FunctionalComponentShallowMountOptions<V>): Promise<Wrapper<CombinedVueInstance<V, {}, {}, {}, Props, {}> & Vue>> {
  options = options ?? {};

  if (!options.localVue) {
    options.localVue = testVue;
  }
  const wrapper = shallowMount(component, options);
  if (wrapper.vm) {
    await wrapper.vm.$nextTick();
  }
  return wrapper;
}

export function mountCompositionWithWrapper<TComposition>(factory: () => TComposition) {
  let composition: TComposition | null = null;
  const mountOptions: ShallowMountOptions<Vue> = { localVue: testVue };

  const wrapper = shallowMount(
    {
      setup() {
        composition = factory();
        return composition;
      },
      render(h) {
        return h('div');
      }
    },
    mountOptions
  );

  return {
    wrapper,
    composition
  };
}

export function mountComposition<TComposition>(factory: () => TComposition): TComposition {
  const result = mountCompositionWithWrapper(factory);
  return result.composition!;
}

export {
  easyMount,
  easyShallowMount
};
