import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CoreModule } from 'core/core.module';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';

import {
  PoModule,
  PoButtonModule,
  PoLoadingModule,
  PoI18nPipe,
} from '@po-ui/ng-components';

import { TableComponent } from './table.component';
import { ItemTable } from 'taf-fiscal/models/item-table';
import { TableDetailsModule } from './table-details/table-details.module';
import { ValidationPendingTableDetailModule } from 'taf-fiscal/reinf/dashboard/validation/validation-pending-table-detail/validation-pending-table-detail.module';
import { ReportValidationTableDetailModule } from 'taf-fiscal/reinf/reports/report-validation-table-detail/report-validation-table-detail.module';
import { TransmissionPendingTableDetailModule } from 'taf-fiscal/reinf/dashboard/transmission/transmission-pending-table-detail/transmission-pending-table-detail.module';

xdescribe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;
  let mockActiveRoute;
  let mockItemTable: ItemTable;
  let mockItemTableSpecificEvent;
  let originalTimeout: number;

  beforeEach(waitForAsync(() => {
    mockActiveRoute = {
      snapshot: {
        queryParams: {
          period: '012019',
          event: 'R-1000',
        },
      },
    };

    mockItemTable = {
      key: '8121i21j2912919e9j99endi',
      branch: 'Filial',
      taxNumber: '37621100850',
      taxNumberFormated: '376.211.008-50',
      company: 'TOTVS',
      totalInvoice: 1,
      totalGrossValue: 1000,
      totalTaxBase: 1000,
      totalTaxes: 150,
      status: 'transmitted',
      errorId: '1234',
      protocol: '',
    };

    mockItemTableSpecificEvent = {
      branch: 'D MG 01',
      typeOfInscription: '2 - CPF',
      taxNumberFormated: '376.211.008-50',
      taxNumber: '37621100850',
      beginingDate: '072019',
      finishingdate: '082019',
      taxClassification: '',
      isMandatoryBookkeeping: '0 - Empresa não obrigada a ECD',
      isPayrollExemption: '0 - Não Aplicável',
      hasFineExemptionAgreement: '0 - Sem acordo',
      contact: 'John Feldman',
      contactTaxNumber: '376211008-50',
      contactTaxNumberFormated: '376211008-50',
      errorId: '99999',
      protocol: '',
      status: 'notTransmitted',
    };

    TestBed.configureTestingModule({
      declarations: [TableComponent],
      imports: [
        PoModule,
        PoButtonModule,
        PoLoadingModule,
        CoreModule,
        RouterTestingModule,
        TableDetailsModule,
        ValidationPendingTableDetailModule,
        TransmissionPendingTableDetailModule,
        ReportValidationTableDetailModule,
      ],
      providers: [
        PoI18nPipe,
        {
          provide: ActivatedRoute,
          useFactory: () => mockActiveRoute,
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve detectar mudanças no componente sem executar alteração das colunas', () => {
    const spySetShowDetails = spyOn(component, 'setShowDetails');

    component.path = 'validation';

    expect(spySetShowDetails).not.toHaveBeenCalled();
  });

  it('deve chamar a emissão das linhas selecionadas para eventos regulares', () => {
    const spy = spyOn(component, 'emitSelectedEntry');

    spyOn(component.tableComponent, 'getSelectedRows').and.returnValue([
      mockItemTable,
    ]);

    component.onSelectionChange();

    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
  });

  it('deve chamar a emissão das linhas selecionadas para eventos específicos', () => {
    const spy = spyOn(component, 'emitSelectedEntry');

    spyOn(component.tableComponent, 'getSelectedRows').and.returnValue([
      mockItemTableSpecificEvent,
    ]);

    component.onSelectionChange();

    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
  });

  it('deve retornar o estado da propriedade showDetails', () => {
    component.showDetails = true;

    expect(component.setShowDetails()).toBeTruthy();
  });

  it('deve emitir o id do erro', () => {
    const spy = spyOn(component.errorMessage, 'emit');

    component.emitShowError(mockItemTableSpecificEvent);

    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith('99999');
  });

  it('deve emitir as linhas selecionadas', () => {
    const spy = spyOn(component.selectedEntry, 'emit');

    component.emitSelectedEntry([mockItemTable]);

    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith([mockItemTable]);
  });
});
