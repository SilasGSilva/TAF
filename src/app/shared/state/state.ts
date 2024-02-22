import { Draft, produce } from 'immer';
import { BehaviorSubject, Observable } from 'rxjs';

export class State<T> {
  private stateSubject: BehaviorSubject<T>;

  readonly state$: Observable<T>;

  get snapshot(): T {
    return this.stateSubject.value;
  }

  constructor(initialState: T) {
    this.stateSubject = new BehaviorSubject<T>(
      initialState == null ? initialState : { ...initialState },
    );
    this.state$ = this.stateSubject.asObservable();
  }

  protected setState(value: T): T;
  protected setState(value: (draft: Draft<T>) => void): T;
  protected setState(value: T | ((draft: Draft<T>) => void)): T {
    if (typeof value !== 'function') {
      return this.forceSetState(value);
    }
    const newState = produce(this.snapshot, value as any);
    this.stateSubject.next(newState);
    return newState;
  }

  private forceSetState(state: T): T {
    this.stateSubject.next(state);
    return this.snapshot;
  }
}

export function revertStateOnError(
  _target: any,
  _propertyKey: string,
  descriptor: PropertyDescriptor,
): void {
  const originalMethod: any = descriptor.value;
  function revertFunction(this: State<any>, ...args: any[]): Promise<any> {
    const state = this;
    const original = state.snapshot;
    try {
      let result = originalMethod.apply(this, args);
      if (result != null && 'then' in result && typeof result.then === 'function') {
        result = result.then(
          (value: any) => value,
          (error: any) => {
            state['forceSetState'](original);
            throw error;
          },
        );
      }
      return result;
    } catch (e) {
      state['forceSetState'](original);
      throw e;
    }
  }
  descriptor.value = revertFunction;
}
