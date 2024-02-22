import { State, revertStateOnError } from './state';

interface Model {
  readonly counter: number;
}

class NullTestState extends State<Model | null> {}

class TestState extends State<Model> {
  constructor() {
    super({ counter: 0 });
  }

  @revertStateOnError
  sumToCounter(value: number): void {
    this.setState((draft) => {
      draft.counter += value;
    });
    this.normalService();
  }

  @revertStateOnError
  async setCounter(value: number): Promise<void> {
    this.setState({ counter: value });
    await this.asyncService();
  }

  async asyncService(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve);
    });
  }

  normalService(): void {}
}

describe(State.name, () => {
  let testState: TestState;

  beforeEach(() => {
    testState = new TestState();
  });

  it(`${State.name} should be able to accept null states`, () => {
    const state = new NullTestState(null);
    expect(state.snapshot).toBeNull();
  });

  describe(TestState.prototype.sumToCounter.name, () => {
    it('should increase the counter', () => {
      const spy = jasmine.createSpy();
      testState.state$.subscribe(spy);
  
      testState.sumToCounter(44);
  
      expect(spy.calls.allArgs()).toEqual([[{ counter: 0 }], [{ counter: 44 }]]);
      expect(testState.snapshot).toEqual({ counter: 44 });
    });
  
    it('should revert to original state if there was an error', () => {
      const spy = jasmine.createSpy();
      spyOn(testState, 'normalService').and.throwError('');
      testState.state$.subscribe(spy);
  
      expect(() => testState.sumToCounter(44)).toThrowError();
      expect(spy.calls.allArgs()).toEqual([[{ counter: 0 }], [{ counter: 44 }], [{ counter: 0 }]]);
      expect(testState.snapshot).toEqual({ counter: 0 });
    });
  });

  describe(TestState.prototype.setCounter.name, () => {
    it('should set the counter', async () => {
      const spy = jasmine.createSpy();
      testState.state$.subscribe(spy);

      await testState.setCounter(44);

      expect(spy.calls.allArgs()).toEqual([[{ counter: 0 }], [{ counter: 44 }]]);
      expect(testState.snapshot).toEqual({ counter: 44 });
    });

    it('should set the counter and revert if there was an error', async () => {
      const spy = jasmine.createSpy();
      spyOn(testState, 'asyncService').and.returnValue(Promise.reject(''));
      testState.state$.subscribe(spy);

      await expectAsync(testState.setCounter(44)).toBeRejected();
      expect(spy.calls.allArgs()).toEqual([[{ counter: 0 }], [{ counter: 44 }], [{ counter: 0 }]]);
      expect(testState.snapshot).toEqual({ counter: 0 });
    });
  });
});
