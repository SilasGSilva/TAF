import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { PoBreadcrumb, PoDialogService, PoNotificationService, PoTableAction, PoTableColumn, PoToasterOrientation, PoToolbarAction } from '@po-ui/ng-components';
import { ProAppConfigService } from '@totvs/protheus-lib-core';
import { checkIfIsProtheus } from '../../../../util/util';
import { LaborProcess } from '../../../models/labor-process.model';
import { LaborProcessService } from '../../service/labor-process.service';
import { LaborProcessDataStateService } from '../../service/labor-process-data-state.service';

export const DELAY_TO_GET_ERP_RESPONSE_MS = 1_000;

@Component({
  selector: 'app-labor-process-list',
  templateUrl: './labor-process-list.component.html',
  styleUrls: ['./labor-process-list.component.scss'],
})
export class LaborProcessListComponent implements OnInit {
  readonly routerLinkDetail = 'detail';

  queryFieldNrProcess = new UntypedFormControl();

  queryFieldCpf = new UntypedFormControl();

  profileActions: PoToolbarAction[] = [];

  isLoading = false;

  page: number = 1;
  pageSize: number = 20;
  nrProcTrab: string = '';
  cpfTrab: string = '';
  hasNext: boolean = false;

  result: any[] = [];

  breadcrumb: PoBreadcrumb = {
    items: [{ label: 'Início' }],
  };

  isProtheus: boolean = false;

  actions: PoTableAction[] = [
    { label: 'Editar', action: this.editProcess.bind(this) },
    { label: 'Excluir', action: this.confirmDeleteDialog.bind(this) },
  ];

  columns: PoTableColumn[] = [
    {
      label: 'Número do processo',
      property: 'nrProcTrab',
      width: '50%',
    },
    {
      label: 'CPF do trabalhador',
      property: 'cpfTrab',
      width: '50%',
    },
  ];

  get hasVersion(): boolean {
    return this.laborProcessDataStateService.getVersion() != null;
  }

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private service: LaborProcessService,
    private laborProcessDataStateService: LaborProcessDataStateService,
    private dialogService: PoDialogService,
    private configService: ProAppConfigService,
    private notificationService: PoNotificationService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    setTimeout(async () => {
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

      await this.setLaborProcessContextData();
      await this.loadDataToTable();
      this.isLoading = false;
    }, DELAY_TO_GET_ERP_RESPONSE_MS);
  }

  async onShowMore(): Promise<void> {
    this.page = this.page + 1;
    await this.loadDataToTable();
  }

  async loadDataToTable(clear = false): Promise<any> {
    if (clear) {
      this.clearListData();
    }
    this.isLoading = true;
    const nrProcTrab = this.formatQueryFieldValue(this.queryFieldNrProcess.value);
    const cpfTrab = this.formatQueryFieldValue(this.queryFieldCpf.value);

    try {
      const result = await lastValueFrom(this.service.get(this.pageSize, this.page, nrProcTrab, cpfTrab));

      if (result !== null) {
        this.result = [...this.result, ...result.items];
        this.hasNext = result.hasNext;
      }
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        this.handleException(error);
      }
    } finally {
      this.isLoading = false;
    }
  }

  private async setLaborProcessContextData(): Promise<void> {
    try {
      await this.laborProcessDataStateService.setData();
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        this.handleException(error);
      }
    }
  }

  private clearListData(): void {
    this.result = [];
    this.page = 1;
  }

  async editProcess(process: LaborProcess): Promise<void> {
    await this.router.navigate([this.routerLinkDetail, process.id], {
      relativeTo: this.activatedRoute,
    });
  }

  confirmDeleteDialog(item: LaborProcess): void {
    this.dialogService.confirm({
      title: 'Deseja excluir o processo?',
      message: 'Ao excluir esse processo trabalhista, o mesmo ficará indisponível para uso.',
      confirm: () => this.delete(item),
      literals: { cancel: 'Cancelar', confirm: 'Excluir' },
    });
  }

  async delete(process: LaborProcess): Promise<void> {
    this.isLoading = true;

    try {
      await lastValueFrom(this.service.delete(process.id));

      this.loadDataToTable(true);
      this.notificationService.success({
        message: 'Processo excluído com sucesso!',
        orientation: PoToasterOrientation.Top,
        duration: 5_000,
      });
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        this.handleException(error);
      }
    } finally {
      this.isLoading = false;
    }
  }

  logout(): void {
    this.configService.callAppClose(true);
  }

  private handleException(error: HttpErrorResponse): void {
    this.notificationService.error({
      message: (error.error?.Message) ? error.error?.Message : 'Ocorreu um erro, tente novamente!',
      orientation: PoToasterOrientation.Top,
    })
  }

  private formatQueryFieldValue(queryFieldValue: string): string {
    return queryFieldValue ? queryFieldValue.trim() : '';
  }
}
