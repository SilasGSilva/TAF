import { ComponentFixture, TestBed, getTestBed, waitForAsync } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';

import { PoI18nConfig, PoI18nModule } from '@po-ui/ng-components';

import { tafFiscalPt } from 'core/i18n/taf-fiscal-pt';
import { TransmissionPendingTableDetailSecondLevelComponent } from './transmission-pending-table-detail-second-level.component';
import { TableDetailsSecondLevelModule } from 'shared/table/table-details-second-level/table-details-second-level.module';
import { TableDetailsSecondLevelService } from 'shared/table/table-details-second-level/table-details-second-level.service';
import { of } from 'rxjs';

xdescribe('TransmissionPendingTableDetailSecondLevelComponent', () => {
  let component: TransmissionPendingTableDetailSecondLevelComponent;
  let fixture: ComponentFixture<
    TransmissionPendingTableDetailSecondLevelComponent
  >;
  let injector: TestBed;
  let tableDetailsSecondLevelService: TableDetailsSecondLevelService;

  const TAFCompany = { company_code: 'T1', branch_code: 'D MG 01' };
  const company = JSON.stringify(TAFCompany);
  sessionStorage.setItem('TAFCompany', company);

  const mockRouter = {
    navigate: jasmine.createSpy('navigate'),
  };

  const i18nConfig: PoI18nConfig = {
    default: {
      language: 'pt-BR',
      context: 'general',
      cache: true,
    },
    contexts: {
      tafFiscal: {
        'pt-BR': tafFiscalPt,
      },
    },
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TransmissionPendingTableDetailSecondLevelComponent],
      imports: [TableDetailsSecondLevelModule, PoI18nModule.config(i18nConfig)],
      providers: [
        HttpTestingController,
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();
    injector = getTestBed();
    tableDetailsSecondLevelService = TestBed.get(
      TableDetailsSecondLevelService
    );
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(
      TransmissionPendingTableDetailSecondLevelComponent
    );
    component = fixture.componentInstance;
    component.event = '';
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve retornar o detalhamento do 2º nível de documento do evento R-2030', async function() {
    const spySetDetailsItems = spyOn(component, 'setDetailsItems');

    const mockTaxDetail = {
      tax: [
        {
          invoiceSeries: '',
          aliquot: 0,
          type: 'FAT',
          invoice: '1009R20303',
          issueDate: '2018-07-15T00:00:00',
          tax: 110,
          taxBase: 1000,
          typeOfTransfer: '3 - Publicidade',
          grossValue: 1000,
          item: '   ',
          registrationNumber: '',
          recipeCode: '',
        },
        {
          invoiceSeries: '',
          aliquot: 0,
          type: 'FAT',
          invoice: '1009R20304',
          issueDate: '2018-07-15T00:00:00',
          tax: 110,
          taxBase: 1000,
          typeOfTransfer: '4 - Propaganda',
          grossValue: 1000,
          item: '   ',
          registrationNumber: '',
          recipeCode: '',
        },
      ],
    };

    spyOn(tableDetailsSecondLevelService, 'getDetails').and.returnValue(
      of(mockTaxDetail)
    );

    await component.getItems();
    fixture.detectChanges();

    expect(spySetDetailsItems).toHaveBeenCalled();
    expect(component.tableLoad).toBeFalsy();
  });

  it('deve retornar o detalhamento do 2º nível de documento do evento R-2040', async function() {
    const spySetDetailsItems = spyOn(component, 'setDetailsItems');

    const mockTaxDetail = {
      tax: [
        {
          invoiceSeries: '',
          aliquot: 0,
          type: 'FAT',
          invoice: '1009R20403',
          issueDate: '2018-07-15T00:00:00',
          tax: 110.11,
          taxBase: 1001,
          typeOfTransfer: '3 - Publicidade',
          grossValue: 1001,
          item: '   ',
          registrationNumber: '',
          recipeCode: '',
        },
      ],
    };

    spyOn(tableDetailsSecondLevelService, 'getDetails').and.returnValue(
      of(mockTaxDetail)
    );

    await component.getItems();
    fixture.detectChanges();

    expect(spySetDetailsItems).toHaveBeenCalled();
    expect(component.tableLoad).toBeFalsy();
  });

  it('deve retornar os detalhes das colunas do evento R-2030', () => {
    const columns = component.transmissionDetailsSecondLevel('R-2030');

    fixture.detectChanges();

    expect(columns.length).toEqual(3);
    expect(columns[0].property).toBe('typeOfTransfer');
    expect(columns[1].property).toBe('grossValue');
    expect(columns[2].property).toBe('receivedAmount');
  });

  it('deve retornar os detalhes das colunas do evento R-2040', () => {
    const columns = component.transmissionDetailsSecondLevel('R-2040');

    fixture.detectChanges();

    expect(columns.length).toEqual(3);
    expect(columns[0].property).toBe('typeOfTransfer');
    expect(columns[1].property).toBe('grossValue');
    expect(columns[2].property).toBe('receivedAmount');
  });

  it('não deve retornar colunas da tabela', () => {
    const columns = component.transmissionDetailsSecondLevel('');

    fixture.detectChanges();

    expect(columns.length).toEqual(0);
    expect(columns).toEqual([]);
  });
});
