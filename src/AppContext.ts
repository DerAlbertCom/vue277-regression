import { ComponentContext, contextFactory } from "./context";

type State = {
  foo: string;
}

export class AppContext extends ComponentContext<State> {
  protected data(): State {
    return {
      foo: ''
    };
  }
}

export function useAppContext() {
  return contextFactory<AppContext>('AppContext', () => new AppContext());
}
