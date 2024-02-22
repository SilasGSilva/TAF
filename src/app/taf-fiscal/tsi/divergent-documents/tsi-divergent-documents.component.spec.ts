import { HttpService } from './../../../core/services/http.service';
import { tafFiscalPt } from './../../../core/i18n/taf-fiscal-pt';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { LiteralService } from 'core/i18n/literal.service';
import { PoI18nConfig, PoI18nModule } from '@po-ui/ng-components';
import { TafFiscalModule } from 'taf-fiscal/taf-fiscal.module';
import { TsiDivergentDocumentsComponent } from './tsi-divergent-documents.component';
import { MockTsiService } from '../monitor/tsi-monitor.service.spec';
import { TsiDivergentDocumentsTableService } from './table/tsi-divergent-documents-table.service';
import { TsiDivergentDocumentsBody } from '../models/tsi-divergent-documents-body';
import { TsiDivergentDocumentsReinstateRequest } from '../models/tsi-divergent-documents-reinstate-request';
import { corePt } from 'core/i18n/core-pt';

const i18nConfig: PoI18nConfig = {
  default: {
    language: 'pt-BR',
    context: 'general',
    cache: false,
  },
  contexts: {
    core: {
      'pt-BR': corePt
    },
    tafFiscal: {
      'pt-BR': tafFiscalPt,
    },
  },
};

xdescribe('TsiDivergentDocumentsComponent', () => {
  let component: TsiDivergentDocumentsComponent;
  let fixture: ComponentFixture<TsiDivergentDocumentsComponent>;
  let elementFilter:HTMLElement;
  let elementStatus:HTMLElement;
  let elementTable:HTMLElement;
  let elementHeader:HTMLElement;
  let elementButtonTable:HTMLElement;
  let elementButtonReinstateAll:HTMLElement;
  let elementButtonReinstate:HTMLElement;

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
      imports: [TafFiscalModule,RouterTestingModule,PoI18nModule.config(i18nConfig),],
      declarations: [TsiDivergentDocumentsComponent],
      providers: [ LiteralService,
        TsiDivergentDocumentsTableService,
        { provide: HttpService, useClass: MockTsiService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TsiDivergentDocumentsComponent);
    component = fixture.componentInstance;

    component.formFilter = new UntypedFormGroup({
      branchCode: new UntypedFormControl('', [Validators.required]),
      periodFrom: new UntypedFormControl('', []),
      periodTo: new UntypedFormControl('', []),
    });
    component.formFilter.patchValue({ branchCode : 'D MG 01',periodTo: '', periodFrom: '' });
    fixture.detectChanges();
    elementHeader = fixture.debugElement.nativeElement.querySelector('.header');
    elementFilter = fixture.debugElement.nativeElement.querySelector('.filter');
    elementStatus = fixture.debugElement.nativeElement.querySelector('.status');
    elementTable = fixture.debugElement.nativeElement.querySelector('.table');
    elementButtonTable = fixture.debugElement.nativeElement.querySelector('.table');
    elementButtonReinstateAll = fixture.debugElement.nativeElement.querySelector('.buttonReinstateAll');
    elementButtonReinstate = fixture.debugElement.nativeElement.querySelector('.buttonReinstate');
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


  it('deve existir um botão de Reintegrar Notas Fiscais', () => {
    expect(elementButtonReinstateAll).toBeTruthy();
  });

  it('deve existir um botão de Reintegrar Selecionados', () => {
    expect(elementButtonReinstate).toBeTruthy();
  });

  it('deve existir uma tabela', () => {
    expect(elementButtonTable).toBeTruthy();
  });

  it('deve executar a aplicação do filtro', () => {
    component.formFilter = new UntypedFormGroup({
      branchCode: new UntypedFormControl('', [Validators.required]),
      periodFrom: new UntypedFormControl('', []),
      periodTo: new UntypedFormControl('', []),
    });

    component.selectedItens = {
      reprocessAll: false,
      itemsV5R: [],
      itemsSFT: []
    };

    component.formFilter.patchValue({ branchCode : 'D MG 01', periodFrom: '', periodTo: ''});
    component.applyFilterDivergentDocumentsTable(true);
    expect(component.tsiDivergentDocumentsTableItems.length).toEqual(1);
  });

  it('deve executar o botão carregar mais 2 vezes', () => {
    component.formFilter = new UntypedFormGroup({
      branchCode: new UntypedFormControl('', [Validators.required]),
      periodFrom: new UntypedFormControl('', []),
      periodTo: new UntypedFormControl('', []),
    });

    component.selectedItens = {
      reprocessAll: false,
      itemsV5R: [],
      itemsSFT: []
    };

    component.formFilter.patchValue({ branchCode : 'D MG 01', periodFrom: '', periodTo: ''});
    component.applyFilterDivergentDocumentsTable(false);
    component.showMoreDivergentDocuments();
    component.showMoreDivergentDocuments();
    expect(component.tsiDivergentDocumentsTableItems.length).toEqual(3);
  });


  it('deve mostrar o botão Reintegrar Todos', () => {
    const selectedItens:TsiDivergentDocumentsBody = {
        reprocessAll: true,
        itemsV5R: [],
        itemsSFT: []
    };

    component.setItemsSelecteds(selectedItens);
    //Deve apresentar o botão Reintegrar Tudo
    expect(component.showReinstateAll).toBeTrue();
    expect(component.showReinstateSelected).toBeFalse();
  });

  it('deve mostrar o botão Reintegrar Selecionados', () => {
    const selectedItens:TsiDivergentDocumentsBody = {
      reprocessAll: false,
      itemsV5R: [1],
      itemsSFT: [{"branchcode":"D MG 01","operationtype":"0","typingdate":"2022-05-01","series":"1","documentnumber":"FIN103326","participantcode":"FINPIR","store":"01"}]
  };
    component.setItemsSelecteds(selectedItens);
    //Deve apresentar o botão Reintegrar Tudo
    expect(component.showReinstateAll).toBeFalse();
    expect(component.showReinstateSelected).toBeTrue();
  });

  it('deve clicar no botão Reintegrar Todos', () => {
    component.selectedItens = {
      reprocessAll: false,
      itemsV5R: [],
      itemsSFT: []
    };
    const param: TsiDivergentDocumentsReinstateRequest = {
      companyId: 'T1|D MG 01',
      branchCode: 'D MG 01',
      dateOf: '2022-01-01',
      dateUp: '2022-12-31'
    };

    const bodyReinstate: TsiDivergentDocumentsBody = {
      reprocessAll: true,
      itemsV5R: [],
      itemsSFT: []
    };
    component.postReinstateInvoices(JSON.stringify(bodyReinstate),param);

    const modalEl: HTMLElement = fixture.nativeElement.querySelector('po-modal');
    expect(modalEl).withContext('Deve existir um modal')
  });

  it('deve clicar no botão Reintegrar Selecionados', () => {
    component.selectedItens = {
      reprocessAll: false,
      itemsV5R: [],
      itemsSFT: []
    };
    const param: TsiDivergentDocumentsReinstateRequest = {
      companyId: 'T1|D MG 01',
      branchCode: 'D MG 01',
      dateOf: '2022-01-01',
      dateUp: '2022-12-31'
    };

    const bodyReinstate: TsiDivergentDocumentsBody = {
      reprocessAll: false,
      itemsV5R: [1],
      itemsSFT: [{"branchcode":"D MG 01","operationtype":"0","typingdate":"2022-05-01","series":"1","documentnumber":"FIN103326","participantcode":"FINPIR","store":"01"}]
    };
    component.postReinstateInvoices(JSON.stringify(bodyReinstate),param);

    const modalEl: HTMLElement = fixture.nativeElement.querySelector('po-modal');
    expect(modalEl).withContext('Deve existir um modal')
  });

});
