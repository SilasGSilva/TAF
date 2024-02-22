import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { PoBreadcrumb, PoDialogService, PoNotificationService, PoTableAction, PoTableColumn, PoToasterOrientation, PoToolbarAction } from '@po-ui/ng-components';
import { ProAppConfigService } from '@totvs/protheus-lib-core';
import { checkIfIsProtheus } from '../../../../util/util';
import { SimpleProcessTax } from '../../../models/labor-process-taxes.model';
import { LaborProcessTaxInfoService } from '../../service/labor-process-tax-info.service';
import { LaborProcessDataStateService } from '../../service/labor-process-data-state.service';
import { CustomValidators } from '../../validators/custom-validators';
import { COLUMNS } from './constants/data';

@Component({
  selector: 'app-labor-process-tax-list',
  templateUrl: './labor-process-tax-list.component.html',
  styleUrls: ['./labor-process-tax-list.component.scss'],
})
export class LaborProcessTaxListComponent implements OnInit {
  readonly routerLinkDetail = 'detail';

  isProtheus: boolean = false;
  profileActions: PoToolbarAction[] = [];
  page = 1;
  pageSize = 20;

  columns: PoTableColumn[] = COLUMNS;

  actions: PoTableAction[] = [
    {
      action: this.onEdit.bind(this),
      label: 'Editar',
  },
    {
      action: this.confirmDeleteDialog.bind(this),
      label: 'Excluir',
  },
  ];

  rows: SimpleProcessTax[] = [];
  isLoading = false;
  formGroup: UntypedFormGroup = this.fb.group({
    nrProcTrab: [null, CustomValidators.isValidProcessNumber],
    perApurPagto: [null],
  });

  breadcrumb: PoBreadcrumb = {
    items: [{ label: 'Início' }],
  };
  hasNext: boolean = false;

  get hasVersion(): boolean {
    return this.laborProcessDataStateService.getVersion() != null;
  }

  constructor(
    private fb: UntypedFormBuilder,
    private service: LaborProcessTaxInfoService,
    private laborProcessDataStateService: LaborProcessDataStateService,
    private route: ActivatedRoute,
    private router: Router,
    private configService: ProAppConfigService,
    private notificationService: PoNotificationService,
    private dialogService: PoDialogService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.handleGetVersion();

    this.isProtheus = checkIfIsProtheus();
    if (this.isProtheus) {
      this.profileActions.push({
        icon: 'po-icon-exit',
        label: 'Sair',
        type: 'danger',
        separator: true,
        action: () => this.logout(),
      });
    }

    await this.getProcessTaxList(true);
  }

  private handleGetVersion(): void {
    if (this.hasVersion) return;

    this.router.navigate(['labor-process']);
  }

  async onShowMore(): Promise<void> {
    if (this.hasNext) {
      this.page += 1;
      await this.getProcessTaxList();
    }
  }

  async getProcessTaxList(clear = false): Promise<void> {
    if (clear) {
      this.clear();
    }
    const nrProcTrabField = this.formGroup.get('nrProcTrab');
    const perApurPagtoField = this.formGroup.get('perApurPagto');
    if (!nrProcTrabField.valid && !perApurPagtoField.valid) {
      return;
    }
    const nrProcTrab: SimpleProcessTax['nrProcTrab'] = nrProcTrabField.value;
    const perApurPagto: SimpleProcessTax['perApurPagto'] = perApurPagtoField.value;

    this.isLoading = true;
    const result = await lastValueFrom(
      this.service.getAll(this.page, this.pageSize, nrProcTrab, perApurPagto)
    );
    this.rows = [...this.rows, ...result.items];

    this.hasNext = result.hasNext;
    this.isLoading = false;
  }

  clear(): void {
    this.rows = [];
    this.page = 1;
  }

  onEdit(processTax: SimpleProcessTax) {
    this.router.navigate([this.routerLinkDetail, processTax.id], {
      relativeTo: this.route,
    });
  }

  confirmDeleteDialog(item: SimpleProcessTax): void {
    this.dialogService.confirm({
      title: `Excluir período ${item.perApurPagto} do processo ${item.nrProcTrab}?`,
      message: 'Ao excluir esse período, o mesmo ficará disponível apenas para consulta.',
      confirm: () => this.onDelete(item),
      literals: { cancel: 'Cancelar', confirm: 'Excluir' },
    });
  }

  async onDelete(processTax: SimpleProcessTax): Promise<void> {
    const result = await lastValueFrom(this.service.delete(processTax.id));

    if (result) {
      this.getProcessTaxList(true);
      this.notificationService.success({
        message: 'Período excluído com sucesso!',
        orientation: PoToasterOrientation.Top,
        duration: 5_000,
      });
    } else {
      this.notificationService.error({
        message: 'Tente novamente!',
        orientation: PoToasterOrientation.Top,
      });
    }
  }

  logout(): void {
    this.configService.callAppClose(true);
  }
}
