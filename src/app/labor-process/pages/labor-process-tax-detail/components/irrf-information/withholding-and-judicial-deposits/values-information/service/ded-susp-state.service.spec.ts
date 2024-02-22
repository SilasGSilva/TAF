import { DedSusp } from '../../../../../../../../models/labor-process-taxes.model';
import { DedSuspState, DedSuspStateService } from './ded-susp-state.service';

describe(DedSuspStateService.name, () => {
  let service: DedSuspStateService;

  beforeEach(() => {
    service = new DedSuspStateService();
  });

  it('should initialize the state', () => {
    const state = service.snapshot;
    const expectedState: DedSuspState = {
      data: [],
    };

    expect(state).toEqual(expectedState);
  });

  describe(DedSuspStateService.prototype.setData.name, () => {
    it('should update the data state', () => {
      const data = [{}, {}] as DedSusp[];

      service.setData(data);

      expect(service.snapshot.data).toEqual(data);
    });
  });

  describe(DedSuspStateService.prototype.setData.name, () => {
    const data = [{}, {}] as DedSusp[];

    beforeEach(() => {
      service.setData(data);
    });

    it('should return the data state', () => {
      const result = service.getData();

      expect(result).toEqual(data);
    });
  });

  describe(DedSuspStateService.prototype.resetData.name, () => {
    beforeEach(() => {
      const data = [{}, {}] as DedSusp[];

      service.setData(data);
    });

    it('should reset the data state', () => {
      service.resetData();
      const result = service.getData();

      expect(result).toEqual([]);
    });
  });
});
