import { HttpService } from './../../../../core/services/http.service';
import { TsiTableService } from './../../monitor/table/tsi-table.service';
import { tafFiscalPt } from './../../../../core/i18n/taf-fiscal-pt';
import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TsiHeaderComponent } from './tsi-header.component';
import { MockTsiService } from '../../monitor/tsi-monitor.service.spec';
import { PoI18nConfig, PoI18nModule, PoI18nPipe } from '@po-ui/ng-components';
import { TsiMonitorModule } from 'taf-fiscal/tsi/monitor/tsi-monitor.module';
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



xdescribe('TsiHeaderComponent', () => {
  let component: TsiHeaderComponent;
  let fixture: ComponentFixture<TsiHeaderComponent>;
  let elementTitle:HTMLElement;

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
      declarations: [TsiHeaderComponent],
      imports: [
        RouterTestingModule,
        PoI18nModule.config(i18nConfig),
        TsiMonitorModule
      ],

      providers: [
        PoI18nPipe,
        TsiTableService,
        { provide: HttpService, useClass: MockTsiService },
      ]
    }).compileComponents();


    fixture = TestBed.createComponent(TsiHeaderComponent);
    component = fixture.componentInstance;
    elementTitle = fixture.debugElement.nativeElement.querySelector('.title');
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve existir a class title', () => {
    expect(elementTitle).toBeTruthy();
  });

  it('deve existir um titulo com o nome Log de Processamentos', () => {
    component.headerTitle = component.literals['tsiMonitor']['title'];
    fixture.detectChanges();
    expect( elementTitle.textContent.trim()).toEqual( component.literals['tsiMonitor']['title'] );
  });

  it('deve existir um titulo com o nome Documentos Divergentes', () => {
    component.headerTitle = component.literals['tsiDivergentDocuments']['title'];
    fixture.detectChanges();
    expect( elementTitle.textContent.trim()).toEqual( component.literals['tsiDivergentDocuments']['title'] );
  });

  xit('deve verificar se o painel está sendo executado por dentro do protheus ', () => {
    const spy = spyOn(component, 'isEmbeded').and.callThrough();
    component.isEmbeded();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });

  xit('deve chamar a função que exibe o versionModal', () => {
    //const spyVersionModal = spyOn(component.versionModal, 'show');

    component.openVersionModal('vTAFA552-1.0.26');
    //component.profileActions[0]['action']();
    fixture.detectChanges();
    expect(component.versionModal).toBeTruthy();
    //expect(spyVersionModal).toHaveBeenCalledWith('vTAFA552-1.0.26');
  });

  xit('deve preencher o profileActions quando não está embarcado', fakeAsync(() => {
    const spyIsEmbeded = spyOn(component, 'isEmbeded').and.returnValue(true);

    component.isEmbeded();
    fixture.detectChanges();
    expect(spyIsEmbeded).toHaveBeenCalled();
    expect(component.profileActions.length).toEqual(2);
  }));

  xit('deve verificar se o painel está sendo executado por dentro do protheus ', () => {
    const spy = spyOn(component, 'isEmbeded').and.callThrough();
    component.isEmbeded();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });

  xit('deve realizar o logout com o isEmbeded false ', () => {
    const spy = spyOn<any>(component, 'logout').and.callThrough();
    const spyIsEmbeded = spyOn(component, 'isEmbeded').and.returnValue(false);

    component.profileActions[1]['action']();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
    expect(spyIsEmbeded).toHaveBeenCalled();
  });

  xit('deve chamar a função que exibe o versionModal', () => {
    const spyVersionModal = spyOn(component.versionModal, 'show');

    sessionStorage.setItem('ERPAPPCONFIG', '{"tafVersion":"12.23.0"}');
    component.profileActions[0]['action']();
    fixture.detectChanges();
    expect(component.versionModal).toBeTruthy();
    expect(spyVersionModal).toHaveBeenCalledWith('12.23.0');
  });

  xit('deve preencher o profileActions quando não está embarcado', fakeAsync(() => {
    const spyIsEmbeded = spyOn(component, 'isEmbeded').and.returnValue(true);

    component.isEmbeded();
    fixture.detectChanges();
    expect(spyIsEmbeded).toHaveBeenCalled();
    expect(component.profileActions.length).toEqual(2);
  }));
});
