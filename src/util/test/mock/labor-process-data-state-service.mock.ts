import { ESocialVersionEnum } from '../../../app/models/labor-process.model';

export class LaborProcessDataStateServiceMock {
  async setData(): Promise<void> {
  }

  getVersion(): ESocialVersionEnum {
    return ESocialVersionEnum.v1;
  }

  getBranchId(): string {
    return 'mockBranchId';
  }

  getCompanyId(): string {
    return 'mockCompanyId';
  }

  getUserName(): string {
    return 'mockUserName';
  }
}
