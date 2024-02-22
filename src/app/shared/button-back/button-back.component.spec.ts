import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  Location,
  LocationStrategy,
  PathLocationStrategy,
  APP_BASE_HREF,
} from '@angular/common';

import {
  PoButtonModule,
  PoI18nConfig,
  PoI18nModule,
  PoI18nPipe
} from '@po-ui/ng-components';

import { ButtonBackComponent } from './button-back.component';
import { sharedPt } from 'core/i18n/shared-pt';

xdescribe('ButtonBackComponent', () => {
  let component: ButtonBackComponent;
  let fixture: ComponentFixture<ButtonBackComponent>;

  const i18nConfig: PoI18nConfig = {
    default: {
      language: 'pt-BR',
      context: 'general',
      cache: true,
    },
    contexts: {
      shared: {
        'pt-BR': sharedPt,
      },
    },
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ButtonBackComponent],
      imports: [
        PoButtonModule,
        PoI18nModule.config(i18nConfig)
      ],
      providers: [
        PoI18nPipe,
        Location,
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        { provide: APP_BASE_HREF, useValue: '/my/app' },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve ser criado', () => {
    expect(component).toBeTruthy();
  });

  it('deve retornar para a página anterior', () => {
    const spy = spyOn(component, 'goBackNavigation').and.callThrough();
    component.goBackNavigation();

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
