import { HttpService } from './../../../core/services/http.service';
import { TsiStatusService } from '../shared/header/status/tsi-status.service';
import { TsiFilterService } from '../shared/filter/tsi-filter.service';
import { tafFiscalPt } from './../../../core/i18n/taf-fiscal-pt';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { LiteralService } from 'core/i18n/literal.service';
import { TafFiscalModule } from 'taf-fiscal/taf-fiscal.module';
import { TsiMonitorComponent } from './tsi-monitor.component';
import { MockTsiService } from './tsi-monitor.service.spec';
import { PoI18nConfig, PoI18nModule } from '@po-ui/ng-components';
import { TsiTableService } from './table/tsi-table.service';
import { TsiReprocessRequest } from '../models/tsi-reprocess-request';
import { TsiReprocessBody } from '../models/tsi-reprocess-body';

const i18nConfig: PoI18nConfig = {
  default: {
    language: 'pt-BR',
    context: 'general',
    cache: false,
  },
  contexts: {
    tafFiscal: {
      'pt-BR': tafFiscalPt,
    },
  },
};

xdescribe('TsiMonitorComponent', () => {
  let component: TsiMonitorComponent;
  let fixture: ComponentFixture<TsiMonitorComponent>;
  let elementFilter:HTMLElement;
  let elementStatus:HTMLElement;
  let elementTable:HTMLElement;
  let elementButtonDoc:HTMLElement;
  let elementButtonExport:HTMLElement;
  let elementButtonTable:HTMLElement;
  let elementHeader:HTMLElement;
  let elementButtonReprocessAll:HTMLElement;
  let elementButtonReprocess:HTMLElement;

  beforeEach(async () => {
    const ERPAPPCONFIG = {
      name: 'Protheus THF',
      productLine: 'Protheus',
      tafVersion: 'vTAFA552-1.0.26'
    };

    const config = JSON.stringify(ERPAPPCONFIG);
    sessionStorage.setItem('ERPAPPCONFIG', config);
    const TAFCompany = {
      company_code: 'T1',
      branch_code: 'D MG 01',
    };
    const company = JSON.stringify(TAFCompany);
    sessionStorage.setItem('TAFCompany', company);

    await TestBed.configureTestingModule({
      imports: [TafFiscalModule,RouterTestingModule,PoI18nModule.config(i18nConfig)],
      declarations: [TsiMonitorComponent],
      providers: [ LiteralService,
        TsiTableService,
        { provide: HttpService, useClass: MockTsiService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TsiMonitorComponent);
    component = fixture.componentInstance;

    component.formFilter = new UntypedFormGroup({
      branchCode: new UntypedFormControl('', [Validators.required]),
      periodFrom: new UntypedFormControl('', []),
      periodTo: new UntypedFormControl('', []),
      type: new UntypedFormControl('', []),
    });
    component.formFilter.patchValue({ branchCode : 'D MG 01',periodTo: '', periodFrom: '', type: 'Todos' });
    //fixture.detectChanges();
    elementHeader = fixture.debugElement.nativeElement.querySelector('.header');
    elementFilter = fixture.debugElement.nativeElement.querySelector('.filter');
    elementStatus = fixture.debugElement.nativeElement.querySelector('.status');
    elementTable = fixture.debugElement.nativeElement.querySelector('.table');
    elementButtonDoc = fixture.debugElement.nativeElement.querySelector('.buttonDoc');
    elementButtonExport = fixture.debugElement.nativeElement.querySelector('.buttonExport');
    elementButtonTable = fixture.debugElement.nativeElement.querySelector('.table');
    elementButtonReprocessAll = fixture.debugElement.nativeElement.querySelector('.buttonReprocessAll');
    elementButtonReprocess = fixture.debugElement.nativeElement.querySelector('.buttonReprocess');

  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve existir a class header', () => {
    expect(elementHeader).toBeTruthy();
  });

  it('deve existir a class filter', () => {
    expect(elementFilter).toBeTruthy();
  });

  it('deve existir a class status', () => {
    expect(elementStatus).toBeTruthy();
  });

  it('deve existir a class table', () => {
    expect(elementTable).toBeTruthy();
  });

  it('deve existir um botão de documentação', () => {
    expect(elementButtonDoc).toBeTruthy();
  });

  it('deve existir um botão de Exportar Relatório', () => {
    expect(elementButtonExport).toBeTruthy();
  });

  it('deve existir um botão de Reintegrar Notas Fiscais', () => {
    expect(elementButtonReprocessAll).toBeTruthy();
  });

  it('deve existir um botão de Reintegrar Selecionados', () => {
    expect(elementButtonReprocess).toBeTruthy();
  });

  /*xit('deve exister função para abrir o link da documentação', () => {
    const spy = spyOn(component, 'goToDocumentation').and.callThrough();
    component.goToDocumentation();
    expect(spy).toHaveBeenCalled();
  });*/

  it('deve existir uma tabela', () => {
    expect(elementButtonTable).toBeTruthy();
  });

  it('deve executar a aplicação do filtro', () => {
    component.formFilter = new UntypedFormGroup({
      branchCode: new UntypedFormControl('', [Validators.required]),
      periodFrom: new UntypedFormControl('', []),
      periodTo: new UntypedFormControl('', []),
      type: new UntypedFormControl('', []),
    });
    component.formFilter.patchValue({ branchCode : 'D MG 01',periodTo: '', periodFrom: '', type: 'Todos' });
    component.applyFilterTable(true);
    expect(component.tsiTableItems.length).toEqual(1);
    //Não pode existir nenhum registro selecionado
    expect(component.selectedItens.length).toEqual(0);
    //Deve apresentar o botão Reintegrar Tudo
    expect(component.showReprocessAll).toBeTrue();
  });

  it('deve executar o botão carregar mais', () => {
    component.formFilter = new UntypedFormGroup({
      branchCode: new UntypedFormControl('', [Validators.required]),
      periodFrom: new UntypedFormControl('', []),
      periodTo: new UntypedFormControl('', []),
      type: new UntypedFormControl('', []),
    });
    component.formFilter.patchValue({ branchCode : 'D MG 01',periodTo: '', periodFrom: '', type: 'Todos' });
    component.applyFilterTable(false);
    component.showMoreRegisters();
    expect(component.tsiTableItems.length).toEqual(2);
  });

  it('deve mostrar o botão Reintegrar Notas Fiscais', () => {
    const selectedItens = [];
    component.setItemsSelecteds(selectedItens);
    //Deve apresentar o botão Reintegrar Tudo
    expect(component.showReprocessAll).toBeTrue();
    expect(component.showReprocessSelected).toBeFalse();
  });

  it('deve mostrar o botão Reintegrar Selecionados', () => {
    const selectedItens = [1,2,3];
    component.setItemsSelecteds(selectedItens);
    //Deve apresentar o botão Reintegrar Tudo
    expect(component.showReprocessAll).toBeFalse();
    expect(component.showReprocessSelected).toBeTrue();
  });

  it('deve clicar no botão Reintegrar Notas Fiscais', () => {
    const params: TsiReprocessRequest = {
      companyId: 'T1|D MG 01',
    };

    const bodyReprocess: TsiReprocessBody = {
      reprocessAll: true,
      items: []
    };
    component.postReprocessInvoices(JSON.stringify(bodyReprocess),params);

    const modalEl: HTMLElement = fixture.nativeElement.querySelector('po-modal');
    expect(modalEl).withContext('Deve existir um modal')
  });




});
