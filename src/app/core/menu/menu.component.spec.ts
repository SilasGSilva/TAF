import { ComponentFixture, TestBed, fakeAsync, waitForAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PoI18nConfig, PoI18nPipe, PoI18nModule, PoMenuModule } from '@po-ui/ng-components';
import { MenuComponent } from './menu.component';
import { corePt } from 'core/i18n/core-pt';
import { LiteralService } from 'core/i18n/literal.service';

xdescribe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

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
    },
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        PoI18nModule.config(i18nConfig),
        PoMenuModule,
        RouterTestingModule,
      ],
      declarations: [MenuComponent],
      providers: [LiteralService, PoI18nPipe],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Deve criar o menu com o menuContext igual gpe', fakeAsync(() => {
    sessionStorage.removeItem('TAFContext');
    sessionStorage.setItem('TAFContext', 'gpe');
    component.gpe();
    fixture.detectChanges();
    tick();
    expect(component.menu.length).toEqual(3);
  }));

  it('Deve criar o menu com o menuContext igual reinf com tsi', () => {
    sessionStorage.removeItem('TAFContext');
    sessionStorage.removeItem('TAFTsi');
    sessionStorage.setItem('TAFContext', 'reinf');
    sessionStorage.setItem('TAFTsi', 'tsi');
    component.reinf();
    fixture.detectChanges();
    expect(component.menu.length).toEqual(3);
  });

  it('Deve criar o menu com o menuContext igual reinf sem tsi', () => {
    sessionStorage.removeItem('TAFContext');
    sessionStorage.removeItem('TAFTsi');
    sessionStorage.setItem('TAFContext', 'reinf');
    sessionStorage.setItem('TAFTsi', '');
    component.reinf();
    fixture.detectChanges();
    expect(component.menu.length).toEqual(3);
  });

  it('Deve criar o menu com o menuContext igual esocial', () => {
    sessionStorage.removeItem('TAFContext');
    sessionStorage.setItem('TAFContext', 'esocial');
    component.esocial();
    fixture.detectChanges();
    expect(component.menu.length).toEqual(3);
  });

  it('Deve criar o menu com o menuContext igual editorXML', () => {
    sessionStorage.removeItem('TAFContext');
    sessionStorage.setItem('TAFContext', 'editorXML');
    component.editorXML();
    fixture.detectChanges();
    expect(component.menu.length).toEqual(1);
  });

  it('Deve criar o menu com productLine Protheus', () => {
    sessionStorage.removeItem('TAFContext');
    sessionStorage.setItem('TAFContext', 'reinf');
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('Deve criar o menu com productLine Datasul', () => {
    component.isDatasul = true;
    sessionStorage.removeItem('TAFContext');
    sessionStorage.removeItem('ERPAPPCONFIG');
    const ERPAPPCONFIG = {
      productLine: 'Datasul'
    };
    const config = JSON.stringify(ERPAPPCONFIG);
    sessionStorage.setItem('ERPAPPCONFIG', config);
    sessionStorage.setItem('TAFContext', 'Datasul');
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('Deve criar o menu com productLine Datasul com isDatasul false', () => {
    component.isDatasul = false;
    sessionStorage.removeItem('TAFContext');
    sessionStorage.removeItem('ERPAPPCONFIG');
    const ERPAPPCONFIG = {
      productLine: 'Datasul'
    };
    const config = JSON.stringify(ERPAPPCONFIG);
    sessionStorage.setItem('ERPAPPCONFIG', config);
    sessionStorage.setItem('TAFContext', 'Datasul');
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
