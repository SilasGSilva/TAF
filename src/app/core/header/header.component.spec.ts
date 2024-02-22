import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PoI18nConfig, PoI18nModule, PoI18nPipe } from '@po-ui/ng-components';
import { CoreModule } from '../../core/core.module';
import { corePt } from '../../core/i18n/core-pt';
import { LiteralService } from '../../core/i18n/literal.service';
import { tafSocialPt } from '../../core/i18n/taf-social-pt';
import { HeaderComponent } from './header.component';

xdescribe('HeaderComponent', () => {
  const i18nConfig: PoI18nConfig = {
    default: {
      language: 'pt-BR',
      context: 'general',
      cache: true,
    },
    contexts: {
      core: {
        'pt-BR': corePt,
      },
      tafSocial: {
        'pt-BR': tafSocialPt,
      },
    },
  };

  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule,
          PoI18nModule.config(i18nConfig),
          RouterTestingModule,
          CoreModule,
        ],
        providers: [LiteralService, PoI18nPipe],
      }).compileComponents();

      const TAFCompany = {
        company_code: 'T1',
        branch_code: 'D MG 01',
      };
      const tafFull = true;

      sessionStorage.setItem('TAFCompany', JSON.stringify(TAFCompany));
      sessionStorage.setItem('TAFFull', JSON.stringify(tafFull));
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve criar o menu do gpe', fakeAsync(() => {
    sessionStorage.setItem('TAFContext', 'gpe');
    component.breadItems = [];
    component.ngOnInit();
    fixture.detectChanges();
    tick();
    expect(component.breadItems.length).toEqual(2);
  }));

  it('deve criar o menu do reinf ', fakeAsync(() => {
    sessionStorage.setItem('TAFContext', 'reinf');
    component.breadItems = [];
    component.ngOnInit();
    fixture.detectChanges();
    tick();
    expect(component.breadItems.length).toEqual(2);
  }));

  it('deve criar o menu do esocial ', fakeAsync(() => {
    sessionStorage.setItem('TAFContext', 'esocial');
    component.breadItems = [];
    component.ngOnInit();
    fixture.detectChanges();
    tick();
    expect(component.breadItems.length).toEqual(2);
  }));

  it('deve criar o menu do editorXML ', fakeAsync(() => {
    sessionStorage.setItem('TAFContext', 'editorXML');
    component.breadItems = [];
    component.ngOnInit();
    fixture.detectChanges();
    tick();
    expect(component.breadItems.length).toEqual(2);
  }));

  it('deve chamar a função addBreadItems com as variáveis headerBreadCrumbLabel2 e headerBreadCrumbLink2 preenchidas', fakeAsync(() => {
    sessionStorage.setItem('TAFContext', 'esocial');
    component.breadItems = [];
    component.headerBreadCrumbLabel2 = 'Menu';
    component.headerBreadCrumbLink2 = '';
    component.ngOnInit();
    fixture.detectChanges();
    tick();
    expect(component.breadItems.length).toEqual(3);
  }));

  it('deve criar o menu do esocial com o ProductLine datasul ', () => {
    sessionStorage.setItem('ERPAPPCONFIG', '{"productLine":"Datasul"}');
    component.breadItems = [];
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.breadItems.length).toEqual(2);
  });

  it('deve criar o menu do esocial com o ProductLine rm ', () => {
    sessionStorage.setItem('ERPAPPCONFIG', '{"productLine":"rm"}');
    component.breadItems = [];
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.breadItems.length).toEqual(2);
  });

  /*it('deve verificar se o painel está sendo executado por dentro do protheus ', () => {
    const spy = spyOn(component, 'isEmbeded').and.callThrough();
    component.isEmbeded();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });

  it('deve realizar o logout com o isEmbeded true e disabledInputs false ', () => {
    const spy = spyOn<any>(component, 'logout').and.callThrough();
    const spyIsEmbeded = spyOn(component, 'isEmbeded').and.returnValue(true);
    const spyWindowConfirm = spyOn(window, 'confirm').and.returnValue(false);

    component.disabledInputs = true;
    component.profileActions[1]['action']();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
    expect(spyIsEmbeded).toHaveBeenCalled();
    expect(spyWindowConfirm).toHaveBeenCalled();
  });


  it('deve realizar o logout com o isEmbeded false ', () => {
    const spy = spyOn<any>(component, 'logout').and.callThrough();
    const spyIsEmbeded = spyOn(component, 'isEmbeded').and.returnValue(false);

    component.disabledInputs = true;
    component.profileActions[1]['action']();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
    expect(spyIsEmbeded).toHaveBeenCalled();
  });
  */

  it('deve chamar a função que exibe o versionModal', () => {
    const spyVersionModal = spyOn(component.versionModal, 'show');

    sessionStorage.setItem('ERPAPPCONFIG', '{"tafVersion":"12.23.0"}');
    component.profileActions[0]['action']();
    fixture.detectChanges();
    expect(component.versionModal).toBeTruthy();
    expect(spyVersionModal).toHaveBeenCalledWith('12.23.0');
  });
  /*
  it('deve preencher o profileActions quando não está embarcado', fakeAsync(() => {
    const spyIsEmbeded = spyOn(component, 'isEmbeded').and.returnValue(true);

    component.isEmbeded();
    fixture.detectChanges();
    expect(spyIsEmbeded).toHaveBeenCalled();
    expect(component.profileActions.length).toEqual(2);
  }));*/
});
