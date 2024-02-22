import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';

import { ProAppConfigService, ProtheusLibCoreModule } from '@totvs/protheus-lib-core';

import { AppComponent } from './app.component';

xdescribe('AppComponent', () => {
  let originalTimeOut: number;
  let config: ProAppConfigService;
  let app: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  const mockRouter = {
    navigate: jasmine.createSpy('navigate'),
  };

  beforeEach(() => {
    originalTimeOut = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 300000;
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, ProtheusLibCoreModule],
      declarations: [AppComponent],
      providers: [{ provide: Router, useValue: mockRouter }],
    }).compileComponents();

    config = TestBed.inject(ProAppConfigService);
    sessionStorage.setItem('ERPAPPCONFIG', '{"productLine":"Protheus"}');
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
  });

  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeOut;
    sessionStorage.removeItem('TAFContext');
    sessionStorage.removeItem('ERPAPPCONFIG');
  });

  it('deve criar o app', () => {
    expect(app).toBeTruthy();
  });

  it('deve abrir a página de acordo com o contexto reinf', () => {
    fixture.detectChanges();
    sessionStorage.setItem('TAFContext', 'reinf');
    app.ngOnInit();
    app.nav('/eventsMonitor');
    expect(app.menuContext).toEqual('reinf');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/eventsMonitor']);
  });

  it('deve abrir a página de acordo com o contexto esocial', () => {
    fixture.detectChanges();
    sessionStorage.setItem('TAFContext', 'esocial');

    app.ngOnInit();
    app.nav('/socialMonitor');

    expect(app.menuContext).toEqual('esocial');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/socialMonitor']);
  });

  it('deve abrir a página de acordo com o contexto gpe', () => {
    fixture.detectChanges();
    sessionStorage.setItem('TAFContext', 'gpe');

    app.ngOnInit();
    app.nav('/socialMonitor');

    expect(app.menuContext).toEqual('gpe');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/socialMonitor']);
  });

  it('deve abrir a página de acordo com o contexto editor xml', () => {
    fixture.detectChanges();
    sessionStorage.setItem('TAFContext', 'editorXML');

    app.ngOnInit();
    app.nav('/editorXML');

    expect(app.menuContext).toEqual('editorXML');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/editorXML']);
  });

  it('deve validar se o product line é do tipo datasul ', () => {
    sessionStorage.setItem('ERPAPPCONFIG', '{"productLine":"Datasul"}');
    sessionStorage.setItem('TAFContext', 'Datasul');

    app.load();

    expect(app.menuContext).toEqual('marcas');
  });

  it('deve validar se o product line é do tipo rm ', () => {
    sessionStorage.setItem('ERPAPPCONFIG', '{"productLine":"RM"}');
    sessionStorage.setItem('TAFContext', 'RM');

    app.load();

    expect(app.menuContext).toEqual('marcas');
  });
});
