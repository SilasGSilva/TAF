import { Injectable } from '@angular/core';
import { State } from '../../../../../../../../shared/state/state';
import { DedSusp } from '../../../../../../../../models/labor-process-taxes.model';

export interface DedSuspState {
  readonly data: DedSusp[];
}

const initialState: DedSuspState = {
  data: [],
}

@Injectable()
export class DedSuspStateService extends State<DedSuspState> {
  constructor() {
    super(initialState);
  }

  getData(): DedSusp[] {
    return this.snapshot.data;
  }

  setData(dedSusp: DedSusp[]): void {
    this.setState(draft => {
      draft.data = dedSusp;
    });
  }

  resetData(): void {
    this.setData(initialState.data);
  }
}
