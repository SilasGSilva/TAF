import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, lastValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { PoBreadcrumb, PoNotificationService, PoToasterOrientation } from '@po-ui/ng-components';
import { DocumentTypeEnum, OptionsAnswer, LaborProcess, InfoContr, TotvsPage, ESocialVersionEnum, TpRegTrabEnum, MtvDesligEnum, TpInscEnum, TpRegPrevEnum, TpContrDuracaoEnum } from '../../../models/labor-process.model';
import { LaborProcessService } from '../../service/labor-process.service';
import { LaborProcessDataStateService } from '../../service/labor-process-data-state.service';
import { CustomValidators } from '../../validators/custom-validators';
import { OptionalValuesFormatterUtils } from '../../utils/optional-values-formatter-utils';
import { PayloadUtils } from './utils/payload-utils';

@Component({
  selector: 'app-labor-process-detail',
  templateUrl: './labor-process-detail.component.html',
  styleUrls: ['./labor-process-detail.component.scss'],
})
export class LaborProcessDetailComponent implements OnInit {
  isLoading = false;

  isEditSubject = new BehaviorSubject(false);
  isEdit: boolean = false;

  id: string = '';

  version: ESocialVersionEnum;

  excluidoERP: OptionsAnswer = OptionsAnswer.No;

  get isExcluded(): boolean {
    return this.excluidoERP === OptionsAnswer.Yes;
  }

  get isV1(): boolean {
    return this.version === ESocialVersionEnum.v1;
  }

  get isV2(): boolean {
    return this.version === ESocialVersionEnum.v2;
  }

  constructor(
    private router: Router,
    private fb: UntypedFormBuilder,
    private notificationService: PoNotificationService,
    private activatedRoute: ActivatedRoute,
    private service: LaborProcessService,
    private laborProcessDataStateService: LaborProcessDataStateService,
  ) { }

  formGroup = this.fb.group(
    {
      companyId: [null],
      branchId: [null],
      userName: [null],
      excluidoERP: [OptionsAnswer.No],
      infoProcesso: this.fb.group({
        ideResp: this.fb.group({
          tpInsc: [null],
          nrInsc: [null],
        }),
        origem: [null, CustomValidators.requiredIgnoreWhiteSpace],
        nrProcTrab: [null, CustomValidators.requiredIgnoreWhiteSpace],
        obsProcTrab: [null],
        dadosCompl: this.fb.group({
          infoProcJud: this.fb.group({
            ufVara: [null],
            dtSent: [null],
            codMunic: [null],
            idVara: [null],
          }),
          infoCCP: this.fb.group({
            dtCCP: [null],
            tpCCP: [null],
            cnpjCCP: [null, CustomValidators.cnpj],
          }),
        }),
      }),
      ideTrab: this.fb.group({
        cpfTrab: [null, CustomValidators.cpf],
        nmTrab: [null],
        dtNascto: [null],
        dependente: this.fb.control([]),
        infoContr: this.fb.control(
          [],
          [Validators.minLength(1), CustomValidators.requiredIgnoreWhiteSpace]
        ),
      }),
    },
    {
      validators: [
        CustomValidators.same(
          'ideTrab.cpfTrab',
          'infoProcesso.ideResp.nrInsc',
          'cpfEqualityInternal'
        ),
        LaborProcessDetailComponent.cpfEqualityValidator,
      ],
    }
  );

  ngOnInit(): void {
    this.isLoading = true;
    this.getVersion();

    this.activatedRoute.params.subscribe(async params => {
      const { id } = params;
      const hasId = id !== undefined;

      this.id = id;

      if (!hasId) {
        this.isEditSubject.next(false);
        this.isEdit = false;

        return;
      }

      await this.getExistentProcessData(id);
    });
    this.isLoading = false;
  }

  private getVersion() {
    this.version = this.laborProcessDataStateService.getVersion(true);

    if (this.version === null) {
      this.router.navigate(['/labor-process']);
    }
  }

  private async getExistentProcessData(id: string): Promise<void> {
    this.isEditSubject.next(true);
    this.isEdit = true;
    this.isLoading = true;

    try {
      const result = await lastValueFrom(this.service.getSimple(id));

      if (result === null) return;

      const laborProcess = OptionalValuesFormatterUtils.removeDefaultOptionalValues(result.items[0]);
      this.formGroup.patchValue(laborProcess);
      this.excluidoERP = laborProcess.excluidoERP === OptionsAnswer.Yes ? OptionsAnswer.Yes : OptionsAnswer.No;

    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        this.handleException(error);
      }

    } finally {
      this.isLoading = false;
    }
  }

  title$ = combineLatest([this.isEditSubject]).pipe(
    map(([isEdit]) =>
      isEdit
        ? 'Edição de processo trabalhista'
        : 'Cadastro de processo trabalhista'
    )
  );

  static cpfEqualityValidator(formGroup: UntypedFormGroup): ValidationErrors | null {
    const tpInsc: DocumentTypeEnum = formGroup.get(
      'infoProcesso.ideResp.tpInsc'
    ).value;
    if (tpInsc === DocumentTypeEnum.Cpf) {
      const validator = CustomValidators.same(
        'infoProcesso.ideResp.nrInsc',
        'ideTrab.cpfTrab',
        'cpfEqualityExternal'
      );
      return validator(formGroup);
    }
    return null;
  }

  async goToPreviousPage(): Promise<void> {
    await this.router.navigate(['labor-process']);
  }

  breadcrumb$: PoBreadcrumb = {
    items: [
      { label: 'Início', link: '/labor-process' },
      {
        label: this.isEditSubject
          ? 'Edição de processo trabalhista'
          : 'Cadastro de processo trabalhista',
      },
    ],
  };

  breadCrumb$ = combineLatest([this.isEditSubject]).pipe(
    map(([isEdit]) => {
      const breadcrumb: PoBreadcrumb = {
        items: [],
      };

      breadcrumb.items.push({
        label: 'Início',
        link: '/labor-process',
      });

      breadcrumb.items.push({
        label: isEdit
          ? 'Edição de processo trabalhista'
          : 'Cadastro de processo trabalhista',
      });

      return breadcrumb;
    })
  );

  async save(): Promise<void> {
    if (!this.formGroup.valid) {
      this.formGroup.markAsDirty();
      return;
    }

    this.isLoading = true;

    const laborProcessItem = this.createLaborProcessItem();
    if (this.isV1) {
      this.formatLaborProcessV1(laborProcessItem);
    }
    if (this.isV2) {
      this.formatLaborProcessV2(laborProcessItem);
    }

    const laborProcess = {
      hasNext: false,
      items: [laborProcessItem],
    };

    const isUpdate = this.isEditSubject.value;
    const createOrUpdateLaborProcess = this.getCreateOrUpdateLaborProcessFunction(laborProcess, isUpdate);
    const successMessage = isUpdate
      ? 'Processo trabalhista alterado com sucesso!'
      : 'Processo trabalhista cadastrado com sucesso!';

    try {
      const result = await lastValueFrom(createOrUpdateLaborProcess());

      this.handleCreateOrUpdateProcessSuccess(successMessage, Boolean(result));
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        this.handleException(error);
      }
    } finally {
      this.isLoading = false;
    }
  }

  private createLaborProcessItem(): LaborProcess {
    const item = this.getLaborProcessItemCopy();

    item.excluidoERP = OptionsAnswer.No;

    item.companyId = this.laborProcessDataStateService.getCompanyId();
    item.branchId = this.laborProcessDataStateService.getBranchId();
    item.userName = this.laborProcessDataStateService.getUserName();

    const formattedItem = OptionalValuesFormatterUtils.changeSelectEmptyValuesToNull(item);
    PayloadUtils.changeOptionalValuesLaborProcess(formattedItem);

    return formattedItem;
  }

  private getLaborProcessItemCopy(): LaborProcess {
    const item: LaborProcess = this.formGroup.getRawValue();

    return JSON.parse(JSON.stringify(item));
  }

  private formatLaborProcessV1(laborProcess: LaborProcess): void {
    laborProcess.ideTrab.infoContr.forEach(infoContr => {
      delete infoContr.ideEstab.infoVlr.indReperc;
      delete infoContr.ideEstab.infoVlr.indenSD;
      delete infoContr.ideEstab.infoVlr.indenAbono;
      delete infoContr.ideEstab.infoVlr.abono;

      infoContr.ideEstab.infoVlr.idePeriodo.forEach(idePeriodo => {
        delete idePeriodo.infoFGTS.vrBcFGTSProcTrab;
        delete idePeriodo.infoFGTS.vrBcFGTSSefip;
        delete idePeriodo.infoFGTS.vrBcFGTSDecAnt;
      });

      delete infoContr.infoCompl.infoVinc.infoDeslig.pensAlim;
      delete infoContr.infoCompl.infoVinc.infoDeslig.percAliment;
      delete infoContr.infoCompl.infoVinc.infoDeslig.vrAlim;
    });
  }

  private formatLaborProcessV2(laborProcess: LaborProcess): void {
    delete laborProcess.ideTrab.dependente;

    laborProcess.ideTrab.infoContr.forEach(infoContr => {
      delete infoContr.indUnic;

      delete infoContr.ideEstab.infoVlr.repercProc;
      delete infoContr.ideEstab.infoVlr.vrInden;
      delete infoContr.ideEstab.infoVlr.vr13API;
      delete infoContr.ideEstab.infoVlr.vrAPI;
      delete infoContr.ideEstab.infoVlr.vrRemun;
      delete infoContr.ideEstab.infoVlr.vrBaseIndenFGTS;
      delete infoContr.ideEstab.infoVlr.pagDiretoResc;

      infoContr.ideEstab.infoVlr.idePeriodo.forEach(idePeriodo => {
        delete idePeriodo.baseCalculo.vrBcFgts;
        delete idePeriodo.baseCalculo.vrBcFgts13;

        delete idePeriodo.infoFGTS.vrBcFgtsGuia;
        delete idePeriodo.infoFGTS.vrBcFgts13Guia;
        delete idePeriodo.infoFGTS.pagDireto;
      });
    });
  }

  private getCreateOrUpdateLaborProcessFunction(laborProcess: TotvsPage<LaborProcess>, isUpdate: boolean): Function {
    if (isUpdate) {
      return () => this.service.update(this.id, laborProcess.hasNext, laborProcess.items);
    }

    return () => this.service.post(laborProcess.hasNext, laborProcess.items);
  }

  convertData(dateSend: string): string {
    let date = dateSend;
    const newDate = date.split('/');
    return newDate[1] + '-' + newDate[0];
  }

  private handleException(error: HttpErrorResponse): void {
    this.notificationService.error({
      message: (error.error?.Message) ? error.error?.Message : 'Ocorreu um erro, tente novamente!',
      orientation: PoToasterOrientation.Top,
    })
  }

  private handleCreateOrUpdateProcessSuccess(successMessage: string, hasResult: boolean): void {
    if (!hasResult) {
      this.notificationService.error({
        message: 'Tente novamente!',
        orientation: PoToasterOrientation.Top,
      });
      return;
    }

    this.goToPreviousPage();
    this.notificationService.success({
      message: successMessage,
      orientation: PoToasterOrientation.Top,
      duration: 5_000,
    });
  }
}
