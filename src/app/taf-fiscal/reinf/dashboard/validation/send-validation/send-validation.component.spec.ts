import { ComponentFixture, TestBed, getTestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

import {
  PoButtonModule,
  PoLoadingModule,
  PoModule,
  PoNotificationService,
  PoI18nPipe,
  PoNotificationModule,
  PoFieldModule,
} from '@po-ui/ng-components';

import { CoreModule } from 'core/core.module';
import { SendValidationService } from './send-validation.service';
import { SendValidationComponent } from './send-validation.component';
import { ItemTableValidation } from '../../../../models/item-table-validation';
import { MessengerModule } from 'shared/messenger/messenger.module';
import { FormsModule } from '@angular/forms';

xdescribe('SendValidationComponent', () => {
  let component: SendValidationComponent;
  let fixture: ComponentFixture<SendValidationComponent>;
  let mockSelectedEntry: Array<ItemTableValidation>;
  let mockActiveRoute;
  let send: SendValidationService;
  let notification: PoNotificationService;
  let injector: TestBed;
  let originalTimeout;

  beforeEach(waitForAsync(() => {
    mockActiveRoute = {
      snapshot: {
        queryParams: {
          period: '012019',
          event: 'R-2010',
        },
      },
    };

    TestBed.configureTestingModule({
      declarations: [SendValidationComponent],
      imports: [
        PoModule,
        PoButtonModule,
        PoLoadingModule,
        CoreModule,
        RouterTestingModule,
        PoNotificationModule,
        MessengerModule,
        PoFieldModule,
        FormsModule,
      ],
      providers: [
        PoI18nPipe,
        {
          provide: ActivatedRoute,
          useFactory: () => mockActiveRoute,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SendValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 13000000;

    mockSelectedEntry = [
      {
        taxNumberFormated: '01.601.250/0001-40',
        taxNumber: '01601250000140',
        status: 'validated',
        branchId: 'D MG 01 ',
        totalTaxBase: 661.92,
        totalTaxes: 58.24,
        key: '01601250000140',
        totalInvoice: 2,
        totalGrossValue: 661.92,
        branch: 'Filial BELO HOR',
        company: 'MILCLEAN 10',
        errors: 'errors',
      },
    ];

    injector = getTestBed();
    send = injector.get(SendValidationService);
    notification = injector.get(PoNotificationService);
  }));

  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  it('deve ser criado o component', () => {
    expect(component).toBeTruthy();
  });

  it('deve desativar o botão de apuração', () => {
    component.disableButton();
    expect(component['disabledButton']).toBeTruthy();
  });

  it('deve ativar o botão de apuração', () => {
    component.enableButton();
    expect(component['disabledButton']).toBeFalsy();
  });

  it('deve definir os itens a serem apurados', () => {
    component.setSelectedEntry(mockSelectedEntry);
    expect(component['selectedEntry']).toEqual(mockSelectedEntry);
  });

  it('deve transmitir os itens selecionados', async function() {
    component.setSelectedEntry(mockSelectedEntry);

    spyOn(send, 'executePenddingValidation').and.returnValue(
      of({ success: true, message: '' })
    );

    await component.executePenddingValidation();

    fixture.detectChanges();

    expect(component.messageSucess).toEqual(true);
  });

  it('não deve transmitir os itens selecionados', async function() {
    component.setSelectedEntry(mockSelectedEntry);

    spyOn(send, 'executePenddingValidation').and.returnValue(
      of({
        success: false,
        message:
          'Erro - Tabela de Cadastro "Procs Referenciado" ( C1G e T5L ) e tabelas de apuração "R-1070" - Processos Adm/Judiciais ( T9V e T9X ) obrigatoriamente devem ter o mesmo nível de compartilhamento.',
      })
    );

    await component.executePenddingValidation();

    fixture.detectChanges();

    expect(component.messageSucess).toEqual(false);
  });

  it('deve lidar com a mensagem de erro http', async function() {
    const error500 = throwError({ status: 401 });
    const spyNotification = spyOn(component['poNotificationService'], 'error');

    spyOn(send, 'executePenddingValidation').and.returnValue(error500);
    await component.setSelectedEntry(mockSelectedEntry);
    await component.executePenddingValidation();

    fixture.detectChanges();

    expect(spyNotification).toHaveBeenCalled();
  });
});
