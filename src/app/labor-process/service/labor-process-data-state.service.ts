import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { PoNotificationService, PoToasterOrientation } from '@po-ui/ng-components';
import { getBranchCode, getCompanyId, getUserName } from '../../../util/util';
import { State } from '../../shared/state/state';
import { ESocialVersionEnum } from '../../models/labor-process.model';
import { ESocialVersionService } from './e-social-version.service';

export interface LaborProcessDataState {
  readonly version: ESocialVersionEnum;
  readonly branchId: string;
  readonly companyId: string;
  readonly userName: string;
}

const initialState: LaborProcessDataState = {
  version: null,
  branchId: '',
  companyId: '',
  userName: '',
}

@Injectable()
export class LaborProcessDataStateService extends State<LaborProcessDataState> {
    constructor(private eSocialVersionService: ESocialVersionService, private notificationService: PoNotificationService) {
    super(initialState);
  }

  async setData(): Promise<void> {
    const branchId = getBranchCode();
    const companyId = getCompanyId();
    const userName = getUserName();

    const result = await lastValueFrom(this.eSocialVersionService.get(companyId, branchId));
    const itemResult = result.items[0];

    this.setState(draft => {
      draft.version = itemResult.eSocialLayoutVersion;
      draft.branchId = itemResult.branchId || branchId;
      draft.companyId = itemResult.companyId || companyId;
      draft.userName = userName;
    });
  }

  getVersion(showError: boolean = false): ESocialVersionEnum {
    const version = this.snapshot.version;
    if (!ESocialVersionEnum[version]) {
      if (showError) {
        this.raiseNoVersionError();
      }

      return null;
    }

    return version;
  }

  getBranchId(): string {
    const branchId = this.snapshot.branchId;

    return branchId || getBranchCode() || initialState.branchId;
  }

  getCompanyId(): string {
    const companyId = this.snapshot.companyId;

    return companyId || getCompanyId() || initialState.companyId;
  }

  getUserName(): string {
    const userName = this.snapshot.userName;

    return userName || getUserName() || initialState.userName;
  }

  private raiseNoVersionError(): void {
    this.notificationService.error({
      message: 'Versão parametrizada de leiaute não registrada. Favor verificar a parametrização do eSocial no módulo da Folha de Pagamento.',
      orientation: PoToasterOrientation.Top,
    });
  }
}
