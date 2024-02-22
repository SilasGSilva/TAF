import { ComponentFixture, TestBed, inject, getTestBed, fakeAsync } from '@angular/core/testing';
import { ReactiveFormsModule, UntypedFormBuilder, Validators, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';

import { PoModule, PoFieldModule, PoButtonModule, PoWidgetModule, PoLoadingModule, PoI18nPipe, PoSelectOption } from '@po-ui/ng-components';

import { ReportFilterComponent } from './report-filter.component';
import { SharedModule } from 'shared/shared.module';
import { CoreModule } from 'core/core.module';
import { ReportFilterService } from './report-filter.service';
import { ReportListingResponse } from '../../../models/report-listing-response';
import { EventListingResponse } from '../../../models/event-listing-response';

xdescribe('ReportFilterComponent', () => {
  let component: ReportFilterComponent;
  let fixture: ComponentFixture<ReportFilterComponent>;
  let injector: TestBed;
  let reportService: ReportFilterService;
  let dummyReportListingResponse: ReportListingResponse;
  let dummyEventListingResponse: EventListingResponse;
  let mockPoSelectOption: Array<PoSelectOption>;
  let originalTimeout: number;
  let timerCallback;

  const mockPeriod = '03/2019';
  const moclInvalidPeriod = '03/201';

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CoreModule,
        SharedModule,
        PoModule,
        PoFieldModule,
        PoButtonModule,
        PoWidgetModule,
        PoLoadingModule
      ],
      declarations: [ ReportFilterComponent ],
      providers: [
        PoI18nPipe,
        ReportFilterService
      ]
    })
    .compileComponents();

    injector = getTestBed();
    reportService = injector.get(ReportFilterService);

  }));

  beforeEach(inject([UntypedFormBuilder], (fb: UntypedFormBuilder) => {
    fixture = TestBed.createComponent(ReportFilterComponent);
    component = fixture.componentInstance;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 300000;
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    timerCallback = jasmine.createSpy('timerCallback');
    jasmine.clock().install();

    component.formFilter = fb.group({
      period: ['032019', Validators.required],
      event: ['Eventos', Validators.required]
    });

    dummyReportListingResponse = {
      descriptionEvent: 'Retenção contribuição previdenciária - serviços tomados',
      hasNext: false,
      eventDetail: [
        {
          branch: '',
          cnpj: '01601250000140',
          cnpjFormated: '01.601.250/0001-40',
          company: 'MILCLEAN 10',
          totalInvoice: 1,
          totalGrossValue: 330,
          totalTaxBase: 330,
          totalTaxes: 29
        }
      ]
    };

    spyOn(component['reportFilterService'], 'getEventListing').and.returnValue(of({ eventsReinf: [{ event: 'R-2010'}] }));

  }));

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('deve executar o debounce do campo period, para carregamento dos eventos do período selecionado', () => {
    const spyPeriodTransform = spyOn(component, 'transformPeriod');
    const spySetStatusLoading = spyOn(component, 'setStatusLoading');
    const spySetInputPeriod = spyOn(reportService, 'setInputPeriod');
    fixture.detectChanges();
    expect(component.formFilter.valid).toBeTruthy();
    expect(spyPeriodTransform).toHaveBeenCalledWith(mockPeriod);
    expect(spySetStatusLoading).toHaveBeenCalledWith(true);
    expect(spySetInputPeriod).toHaveBeenCalled();
  });

  it('não deve chamar o debounce, quando o formulário inválido', () => {
    component.formFilter.controls['period'].setValue('');
    expect(component.formFilter.valid).toBeFalsy();

    const spyPeriodTransform = spyOn(component, 'transformPeriod');
    const spySetInputPeriod = spyOn(reportService, 'setInputPeriod');

    fixture.detectChanges();
    expect(spyPeriodTransform).not.toHaveBeenCalledWith(moclInvalidPeriod);
    expect(spySetInputPeriod).not.toHaveBeenCalled();

  });

  it('deve criar o componente de filtro de relatórios', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('deve preencher as opções de eventos, para o campo de select do filtro do relatório', () => {
    dummyEventListingResponse = {
      eventsReinf: [
        { event: 'R-1000'},
        { event: 'R-2010'},
        { event: 'R-2020'},
      ]
    };

    mockPoSelectOption = [
      { label: 'Eventos', value: 'events'},
      { label: 'R-2010', value: 'R-2010'},
    ];

    component.setEventsOption(dummyEventListingResponse);

    fixture.detectChanges();

    expect(component.eventsOptions).toEqual(mockPoSelectOption);
  });

  it('deve retornar o período inicial, lendo do localstorage o ultimo período selecionado pelo usuário', () => {
    reportService.setInputPeriod('032019');
    fixture.detectChanges();
    expect(component.getInicialPeriod()).toEqual('032019');
  });

  it('deve retornar o período inicial, quando não tiver período pré selecionado no serviço e o mês atual for Janeiro', () => {
    window.localStorage.clear();
    jasmine.clock().mockDate(new Date(2019, 0, 1));

    fixture.detectChanges();
    expect(component.getInicialPeriod()).toEqual('122018');
  });

  it('deve retornar o período transformado para uso na rotina.', () => {
    fixture.detectChanges();
    expect(component.transformPeriod(mockPeriod)).toEqual('032019');
  });

  it('deve alterar o status do loading overlay para false.', () => {
    component.setStatusLoading(false);
    fixture.detectChanges();
    expect(component['loadingOverlay']).toBeFalsy();
  });

  it('deve carregar e emitir os itens da tabela do relatório', () => {
    const spyEmitReportListing = spyOn(component, 'emitReportListing');
    const spySetStatusLoading = spyOn(component, 'setStatusLoading');

    spyOn(component['reportFilterService'], 'getReportListing').and.returnValue(of(dummyReportListingResponse));

    component.getReportListing();
    fixture.detectChanges();

    expect(spyEmitReportListing).toHaveBeenCalled();
    expect(spySetStatusLoading).toHaveBeenCalled();
  });

  it('deve emitir os itens selecionados para geração do relatório', () => {
    const spyEmitReportListing = spyOn(component.reportListing, 'emit');

    component.emitReportListing(dummyReportListingResponse);
    fixture.detectChanges();

    expect(spyEmitReportListing).toHaveBeenCalledWith(dummyReportListingResponse);
  });

});
