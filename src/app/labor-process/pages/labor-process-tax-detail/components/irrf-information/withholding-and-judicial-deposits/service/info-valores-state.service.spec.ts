import { InfoValores } from '../../../../../../../models/labor-process-taxes.model';
import { InfoValoresState, InfoValoresStateService } from './info-valores-state.service';

describe(InfoValoresStateService.name, () => {
  let service: InfoValoresStateService;

  beforeEach(() => {
    service = new InfoValoresStateService();
  });

  it('should initialize the state', () => {
    const state = service.snapshot;
    const expectedState: InfoValoresState = {
      data: [],
    };

    expect(state).toEqual(expectedState);
  });

  describe(InfoValoresStateService.prototype.setData.name, () => {
    it('should update the data state', () => {
      const data = [{}, {}] as InfoValores[];

      service.setData(data);

      expect(service.snapshot.data).toEqual(data);
    });
  });

  describe(InfoValoresStateService.prototype.setData.name, () => {
    const data = [{}, {}] as InfoValores[];

    beforeEach(() => {
      service.setData(data);
    });

    it('should return the data state', () => {
      const result = service.getData();

      expect(result).toEqual(data);
    });
  });

  describe(InfoValoresStateService.prototype.resetData.name, () => {
    beforeEach(() => {
      const data = [{}, {}] as InfoValores[];

      service.setData(data);
    });

    it('should reset the data state', () => {
      service.resetData();
      const result = service.getData();

      expect(result).toEqual([]);
    });
  });
});
