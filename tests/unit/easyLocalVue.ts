import { createLocalVue } from '@vue/test-utils';

const easyLocalVue = () => {
  const localVue = createLocalVue();
  // in case you wonder, normally here are the plugins registered
  return localVue;
};

const testVue = easyLocalVue();

export { easyLocalVue, testVue };
