import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidationErrors } from '@angular/forms';
import { PoAccordionItemComponent, PoTableAction, PoTableColumn } from '@po-ui/ng-components';
import { Subscription } from 'rxjs';
import { DateTime } from 'luxon';
import { Dependente, ESocialVersionEnum, InfoContr, OptionsAnswer, TpDepEnum } from '../../../../../models/labor-process.model';
import { CustomValidators } from '../../../../validators/custom-validators';
import { LaborProcessDataStateService } from '../../../../service/labor-process-data-state.service';
import { COLUMNS } from './constants/data';

interface DependentsView {
  cpfDep: string;
  tpDep: string;
  descDep: string;
}

@Component({
  selector: 'app-laborer-information',
  templateUrl: './laborer-information.component.html',
  styleUrls: [
    './laborer-information.component.scss',
    '../../labor-process-detail.component.scss',
  ],
})
export class LaborerInformationComponent implements OnInit {
  @Input() formGroup: UntypedFormGroup;
  @Input() isEditMode: boolean;

  @ViewChild(PoAccordionItemComponent, { static: true })
  information: PoAccordionItemComponent;

  editIndex: number | null = null;

  typeDependentEnum = TpDepEnum;

  maxDate = DateTime.now().toJSDate();

  isEdit: boolean = false;

  position: number = null;

  rows: DependentsView[] = [];

  version: ESocialVersionEnum;

  private optionsDepEnums = [
    TpDepEnum.Conjuge,
    TpDepEnum.CompanheiroComFilho,
    TpDepEnum.Filho,
    TpDepEnum.FilhoOuEnteadoUniversitário,
    TpDepEnum.IrmaoNetoBisnetoSemArrimoComGuardaJudicial,
    TpDepEnum.IrmaoNetoBisnetoSemArrimoUniversitario,
    TpDepEnum.PaisAvosBisavos,
    TpDepEnum.MenorGuardaJudicial,
    TpDepEnum.PessoaIncapaz,
    TpDepEnum.ExConjuge,
    TpDepEnum.AgregadoOutros,
  ];
  optionsDep = this.optionsDepEnums.map(typeEnum => ({ label: this.convertValueToLabel(typeEnum), value: typeEnum }));

  columns: PoTableColumn[] = COLUMNS;

  actions: PoTableAction[] = [
    { action: this.clickToEditDependent.bind(this), label: 'Editar' },
    { action: this.deleteDependent.bind(this), label: 'Excluir' },
  ];

  subFormGroup: UntypedFormGroup = this.createSubFormGroup();
  isSelected: boolean = false;

  constructor(
    private fb: UntypedFormBuilder,
    private laborProcessDataStateService: LaborProcessDataStateService,
  ) { }

  get formArray(): UntypedFormControl {
    return this.formGroup?.get('ideTrab.dependente') as UntypedFormControl;
  }

  get dependents(): Dependente[] {
    return this.formArray.value ?? [];
  }

  get isV1(): boolean {
    return this.version === ESocialVersionEnum.v1;
  }

  get isRequiredIdeTrabCondicionalFields(): boolean {
    const infoContr: InfoContr[] = this.formGroup.get('ideTrab.infoContr').value || [];

    return !infoContr.some(infoContr => infoContr.indContr === OptionsAnswer.Yes);
  }

  create(): void {
    this.subFormGroup.reset();
    this.isSelected = true;
    this.isEdit = false;
  }

  private createSubFormGroup(): UntypedFormGroup {
    return this.fb.group({
      cpfDep: [null, [CustomValidators.cpf, this.validateNrCpfSame.bind(this)]],
      tpDep: [null],
      descDep: [null],
    });
  }

  excluidoERP: OptionsAnswer = OptionsAnswer.No;
  optionsAnswer = OptionsAnswer;
  subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.version = this.laborProcessDataStateService.getVersion();

    this.transformRows();

    this.subscriptions.push(this.formArray.valueChanges.subscribe(() => {
      this.transformRows();
    }));

    this.subscriptions.push(this.formGroup.get('excluidoERP').valueChanges.subscribe(() => {
      this.excluidoERP = this.formGroup.get('excluidoERP').value === 'S' ? OptionsAnswer.Yes : OptionsAnswer.No;
    }));

    this.subscriptions.push(this.formGroup.get('ideTrab.infoContr')?.valueChanges.subscribe(() => {
      this.updateNmTrabValidity();
      this.updateDtNasctoValidity();
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe())
  }

  transformRows(): void {
    const valueFormArray: Dependente[] = this.dependents;
    this.rows = valueFormArray.map(dependent => {
      const value: DependentsView = {
        cpfDep: dependent.cpfDep,
        tpDep: this.convertValueToLabel(dependent.tpDep),
        descDep: dependent.descDep,
      };
      return value;
    })
  }

  changeValueNullToCorrectType(): void {
    if (this.subFormGroup.value.descDep == null) {
      this.subFormGroup.value.descDep = '';
    }
  }

  saveDependent(): void {
    const value = this.dependents;
    this.changeValueNullToCorrectType();
    this.formArray.setValue([...value, this.subFormGroup.getRawValue()]);
    this.isSelected = false;
  }

  updateDependent(): void {
    const currentValue: Dependente[] = this.formArray.value ?? [];
    this.changeValueNullToCorrectType();
    currentValue.splice(this.editIndex, 1, this.subFormGroup.getRawValue());
    this.formArray.setValue(currentValue);
    this.isSelected = false;
  }

  clickToEditDependent(dep: DependentsView): void {
    const position = this.rows.findIndex(d => d === dep);
    this.isEdit = true;
    this.editIndex = position;
    this.isSelected = true;
    this.subFormGroup.patchValue(this.formArray.value[position]);
  }

  deleteDependent(dep: Dependente): void {
    const position = this.rows.findIndex(d => d === dep);
    const currentValue: Dependente[] = this.formArray.value ?? [];
    currentValue.splice(position, 1);
    this.formArray.setValue(currentValue);
    this.isEdit = false;
    this.isSelected = false;
  }

  cancel(): void {
    this.isSelected = false;
  }

  convertValueToLabel(tpDep: TpDepEnum): string {
    const valueLabelsHash = {
      [TpDepEnum.Conjuge]: 'Cônjuge',
      [TpDepEnum.CompanheiroComFilho]: 'Companheiro(a) com o(a) qual tenha filho ou viva há mais de 5 (cinco) anos ou possua declaração de união estável',
      [TpDepEnum.Filho]: 'Filho(a) ou enteado(a)',
      [TpDepEnum.FilhoOuEnteadoUniversitário]: 'Filho(a) ou enteado(a), universitário(a) ou cursando escola técnica de 2º grau',
      [TpDepEnum.IrmaoNetoBisnetoSemArrimoComGuardaJudicial]: 'Irmão(ã), neto(a) ou bisneto(a) sem arrimo dos pais, do(a) qual detenha a guarda judicial',
      [TpDepEnum.IrmaoNetoBisnetoSemArrimoUniversitario]: 'Irmão(ã), neto(a) ou bisneto(a) sem arrimo dos pais, universitário(a) ou cursando escola técnica de 2° grau, do(a) qual detenha a guarda judicial',
      [TpDepEnum.PaisAvosBisavos]: 'Pais, avós e bisavós',
      [TpDepEnum.MenorGuardaJudicial]: 'Menor pobre do qual detenha a guarda judicial',
      [TpDepEnum.PessoaIncapaz]: 'A pessoa absolutamente incapaz, da qual seja tutor ou curador',
      [TpDepEnum.ExConjuge]: 'Ex-cônjuge',
      [TpDepEnum.AgregadoOutros]: 'Agregado/Outros',
    };

    return valueLabelsHash[tpDep] || '';
  }

  showDuplicatedNrCpfMessage(): boolean {
    return this.subFormGroup.get('cpfDep').errors?.cpfEqualityInternal && this.subFormGroup.get('cpfDep').value?.length > 0
  }

  private validateNrCpfSame(control: AbstractControl): ValidationErrors {
    if (this.formGroup == null || (this.isEditMode && this.isEdit)) {
      return null;
    }
    return this.isDuplicateNrInsc(control.value) || this.isDuplicateNrCpf(control.value) ? { cpfEqualityInternal: true } : null;
  }

  private isDuplicateNrInsc(currentValue: string): boolean {
    return this.formGroup.get('infoProcesso.ideResp.nrInsc')?.value == currentValue;
  }

  private isDuplicateNrCpf(currentValue: string): boolean {
    return this.formGroup.get('ideTrab.cpfTrab')?.value == currentValue || this.isDuplicateNrCpfDependent(currentValue);
  }

  private isDuplicateNrCpfDependent(currentValue: string): boolean {
    return this.formGroup.get('ideTrab.dependente')?.value.find(dep => dep.cpfDep === currentValue) != null;
  }

  private updateNmTrabValidity(): void {
    const nmTrabField = this.formGroup.get('ideTrab.nmTrab');
    const errors = this.isRequiredIdeTrabCondicionalFields && !nmTrabField.value
      ? { isRequiredNmTrab: true }
      : null;

    nmTrabField.setErrors(errors);
  }

  private updateDtNasctoValidity(): void {
    const dtNasctoField = this.formGroup.get('ideTrab.dtNascto');
    const errors = this.isRequiredIdeTrabCondicionalFields && !dtNasctoField.value
      ? { isRequiredDtNascto: true }
      : null;

    dtNasctoField.setErrors(errors);
  }
}
