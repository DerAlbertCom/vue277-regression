import { ComponentContext, contextFactory } from '../../src/context/ComponentContext';
import { defineComponent, nextTick } from 'vue';
import { easyMount, mountComposition } from './easyMount';

type TestState = {
  name: string;
  value: number;
}


class TestContext extends ComponentContext<TestState> {
  protected data(): TestState {
    return {
      name: 'Albert',
      value: 0
    };
  }

  incrementValue() {
    this.iState.value++;
  }
}

function useTestContext() {
  return contextFactory<TestContext>('TestContext', () => new TestContext());
}


const innerComponent = defineComponent({
  props: {
    variant: {
      type: String,
      default: () => 'x'
    }
  },
  setup(props) {
    const context = useTestContext();
    return {
      state: context.state,
      variant: props.variant
    };
  },
  render(h) {
    return h('div', ` ${this.variant}Inner` + this.state.value.toString());
  }
});

const outerComponent = defineComponent({
  props: {
    variant: {
      type: String,
      require: false,
      default: () => 'x'
    }
  },
  setup(props) {
    const context = useTestContext();

    const increment = () => {
      context.incrementValue();
    };
    return {
      state: context.state,
      variant: props.variant,
      increment
    };
  },
  render(h) {
    return h('div', [
      h(innerComponent, { props: { variant: this.variant } }),
      h('div', ` ${this.variant}Outer` + this.state.value.toString()),
      h(
        'button',
        {
          on: {
            click: this.increment
          }
        },
        ' click me'
      )
    ]);
  }
});

const testComponent = defineComponent({
  setup() {
    return {
      first: 'First',
      second: 'Second'
    };
  },
  render(h) {
    return h('div', [
      h(outerComponent, { props: { variant: this.first } }),
      h(outerComponent, { props: { variant: this.second } })
    ]);
  }
});


describe('Component Context', () => {
  describe('Context direct', function() {
    it('should have the initial values', () => {
      const context = mountComposition(() => useTestContext());
      expect(context.state.value).toBe(0);
      expect(context.state.name).toBe('Albert');
    });

    it('should increment the value in the state', () => {
      const context = mountComposition(() => useTestContext());
      context.incrementValue();
      expect(context.state.value).toBe(1);
    });
  });

  describe('In an Single Out Component', () => {
    it('should render the values', async () => {
      const wrapper = await easyMount(outerComponent);
      expect(wrapper.text()).toContain('xInner0');
      expect(wrapper.text()).toContain('xOuter0');
    });

    it('should render the variant', async () => {
      const wrapper = await easyMount(outerComponent, { propsData: { variant: 'a' } });
      expect(wrapper.text()).toContain('aInner0');
      expect(wrapper.text()).toContain('aOuter0');
    });

    it('should render the the increment value', async () => {
      const wrapper = await easyMount(outerComponent);
      const btn = wrapper.find<HTMLButtonElement>('button');
      btn.trigger('click');
      await nextTick();
      expect(wrapper.text()).toContain('xInner1');
      expect(wrapper.text()).toContain('xOuter1');
    });
  });

  describe('In with Multiple Components', () => {
    it('should render the values', async () => {
      const wrapper = await easyMount(testComponent, {});
      expect(wrapper.text()).toContain('FirstInner0');
      expect(wrapper.text()).toContain('FirstOuter0');
      expect(wrapper.text()).toContain('SecondInner0');
      expect(wrapper.text()).toContain('SecondOuter0');
    });

    it('should only render the values of the first outerComponent', async () => {
      const wrapper = await easyMount(testComponent, {});
      const btn = wrapper.findAll('button').at(0);
      btn.trigger('click');
      await nextTick();
      expect(wrapper.text()).toContain('FirstInner1');
      expect(wrapper.text()).toContain('FirstOuter1');
      expect(wrapper.text()).toContain('SecondInner0');
      expect(wrapper.text()).toContain('SecondOuter0');
    });

    it('should only render the values of the second outerComponent', async () => {
      const wrapper = await easyMount(testComponent, {});
      const btn = wrapper.findAll('button').at(1);
      btn.trigger('click');
      await nextTick();
      expect(wrapper.text()).toContain('FirstInner0');
      expect(wrapper.text()).toContain('FirstOuter0');
      expect(wrapper.text()).toContain('SecondInner1');
      expect(wrapper.text()).toContain('SecondOuter1');
    });
  });

});
