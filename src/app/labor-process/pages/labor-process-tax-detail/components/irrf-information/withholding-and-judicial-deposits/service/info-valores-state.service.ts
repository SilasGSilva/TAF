import { Injectable } from '@angular/core';
import { State } from '../../../../../../../shared/state/state';
import { InfoValores } from '../../../../../../../models/labor-process-taxes.model';

export interface InfoValoresState {
  readonly data: InfoValores[];
}

const initialState: InfoValoresState = {
  data: [],
}

@Injectable()
export class InfoValoresStateService extends State<InfoValoresState> {
  constructor() {
    super(initialState);
  }

  getData(): InfoValores[] {
    return this.snapshot.data;
  }

  setData(infoValores: InfoValores[]): void {
    this.setState(draft => {
      draft.data = infoValores;
    });
  }

  resetData(): void {
    this.setData(initialState.data);
  }
}
