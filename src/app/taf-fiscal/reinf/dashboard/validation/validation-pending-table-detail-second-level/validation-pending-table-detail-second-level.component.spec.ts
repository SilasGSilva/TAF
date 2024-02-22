import { ItemTableDetailsSecondMarketingByFarmer } from 'taf-fiscal/models/item-table-details-second-marketing-by-farmer';
import { ComponentFixture, TestBed, getTestBed, waitForAsync } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import {
  HttpTestingController,
  HttpClientTestingModule,
} from '@angular/common/http/testing';

import { of } from 'rxjs';

import { PoTableColumn } from '@po-ui/ng-components';

import { CoreModule } from 'core/core.module';
import { MasksPipe } from 'shared/pipe/masks.pipe';
import { ValidationPendingTableDetailSecondLevelComponent } from './validation-pending-table-detail-second-level.component';
import { TableDetailsSecondLevelService } from 'shared/table/table-details-second-level/table-details-second-level.service';
import { TableDetailsSecondLevelModule } from 'shared/table/table-details-second-level/table-details-second-level.module';
import { ItemTableDetailsSecondResourcesPassedOnTheByTheSportsAssociation } from 'taf-fiscal/models/item-table-details-second-resources-passed-on-the-by-the-sports-association';
import { ItemTableDetailsSecondResourcesReceivedByTheSportsAssociation } from 'taf-fiscal/models/item-table-details-second-resources-received-by-the-sports-association';

xdescribe('ValidationPendingTableDetailSecondLevelComponent', () => {
  let originalTimeout: number;
  let injector: TestBed;
  let component: ValidationPendingTableDetailSecondLevelComponent;
  let fixture: ComponentFixture<
    ValidationPendingTableDetailSecondLevelComponent
  >;
  let mockTableDetailsSecondLevelService: TableDetailsSecondLevelService;
  let httpTestingController: HttpTestingController;
  let mockTableDetailsSecondColumns: Array<PoTableColumn>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ValidationPendingTableDetailSecondLevelComponent],
      imports: [
        CommonModule,
        BrowserModule,
        TableDetailsSecondLevelModule,
        CoreModule,
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
      ],
      providers: [MasksPipe],
    }).compileComponents();

    injector = getTestBed();
    httpTestingController = TestBed.get(HttpTestingController);
    mockTableDetailsSecondLevelService = injector.get(
      TableDetailsSecondLevelService
    );

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 300000;
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(
      ValidationPendingTableDetailSecondLevelComponent
    );
    component = fixture.componentInstance;
    const TAFCompany = { company_code: 'T1', branch_code: 'D MG 01' };
    const company = JSON.stringify(TAFCompany);
    sessionStorage.setItem('TAFCompany', company);
    component.event = '';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve trazer as colunas do detalhe da tabela de apuração do evento R-2030', () => {
    mockTableDetailsSecondColumns = [
      {
        property: 'type',
        label: 'Tipo',
        type: 'string',
      },
      {
        property: 'invoice',
        label: 'Nº doc',
        type: 'string',
      },
      {
        property: 'invoiceSeries',
        label: 'Série',
        type: 'string',
      },
      {
        property: 'item',
        label: 'Item doc',
        type: 'string',
      },
      {
        property: 'typeOfTransfer',
        label: 'Tipo de repasse',
        type: 'string',
      },
      {
        property: 'issueDate',
        label: 'Data Lcto',
        type: 'date',
        format: 'dd/MM/yyyy',
      },
      {
        property: 'grossValue',
        label: 'Valor bruto ( R$ )',
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'taxBase',
        label: 'Base cálculo ( R$ )',
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'aliquot',
        label: 'Alíquota ( % )',
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'tax',
        label: 'Tributo ( R$ )',
        type: 'number',
        format: '1.2-5',
      },
    ];

    fixture.detectChanges();

    expect(component.validationDetailsSecond('R-2030')).toEqual(
      mockTableDetailsSecondColumns
    );
  });

  it('deve trazer as colunas do detalhe da tabela de apuração do evento R-2040', () => {
    mockTableDetailsSecondColumns = [
      {
        property: 'type',
        label: 'Tipo',
        type: 'string',
      },
      {
        property: 'invoice',
        label: 'Nº doc',
        type: 'string',
      },
      {
        property: 'invoiceSeries',
        label: 'Série',
        type: 'string',
      },
      {
        property: 'item',
        label: 'Item doc',
        type: 'string',
      },
      {
        property: 'typeOfTransfer',
        label: 'Tipo de repasse',
        type: 'string',
      },
      {
        property: 'issueDate',
        label: 'Data Lcto',
        type: 'date',
        format: 'dd/MM/yyyy',
      },
      {
        property: 'grossValue',
        label: 'Valor bruto ( R$ )',
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'taxBase',
        label: 'Base cálculo ( R$ )',
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'aliquot',
        label: 'Alíquota ( % )',
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'tax',
        label: 'Tributo ( R$ )',
        type: 'number',
        format: '1.2-5',
      },
    ];

    fixture.detectChanges();

    expect(component.validationDetailsSecond('R-2040')).toEqual(
      mockTableDetailsSecondColumns
    );
  });

  it('deve trazer as colunas do detalhe da tabela de apuração do evento R-2050', () => {
    mockTableDetailsSecondColumns = [
      {
        property: 'taxDescription',
        label: 'Descrição tributo',
        type: 'string',
      },
      {
        property: 'taxBase',
        label: 'Base cálculo ( R$ )',
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'aliquot',
        label: 'Alíquota ( % )',
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'value',
        label: 'Valor ( R$ )',
        type: 'number',
        format: '1.2-5',
      },
    ];

    fixture.detectChanges();

    expect(component.validationDetailsSecond('R-2050')).toEqual(
      mockTableDetailsSecondColumns
    );
  });

  it('deve chamar o serviço que retornar os itens da tabela e retornar com sucesso', async function() {
    const spySetDetailsItems = spyOn(component, 'setDetailsItems');
    const mockEventDetail: {
      tax: Array<
      | ItemTableDetailsSecondResourcesPassedOnTheByTheSportsAssociation
      | ItemTableDetailsSecondResourcesReceivedByTheSportsAssociation
      >;
    } = {
      tax: [
        {
          invoiceSeries: '1234567890',
          aliquot: 11,
          type: 'Benificio',
          invoice: '1',
          issueDate: '01/01/2020',
          tax: 1,
          taxBase: 100.0,
          typeOfTransfer: 'Repasse',
          grossValue: 1000.0,
          item: '1',
          registrationNumber: '',
          recipeCode: '',
        },
      ],
    };

    spyOn(mockTableDetailsSecondLevelService, 'getDetails').and.returnValue(
      of(mockEventDetail)
    );

    await component.getItems();
    fixture.detectChanges();

    expect(spySetDetailsItems).toHaveBeenCalled();
    expect(component.tableLoad).toBeFalsy();
  });

  it('deve chamar a função que adiciona os itens na tabela', () => {
    const mockTableDetailsItems = [
      {
        aliquot: 11,
        taxBase: 1000.0,
        value: 110.0,
        taxDescription: 'SENAR',
        registrationNumber: '',
        recipeCode: '',
      },
      {
        aliquot: 11,
        taxBase: 1000.0,
        value: 110.0,
        taxDescription: 'GILRAT',
        registrationNumber: '',
        recipeCode: '',
      },
    ];

    component.setDetailsItems(mockTableDetailsItems);
    fixture.detectChanges();

    expect(component.tableDetailsSecondItems.length).toEqual(2);
  });
});
