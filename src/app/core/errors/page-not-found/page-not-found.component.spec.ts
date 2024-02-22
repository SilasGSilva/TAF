import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import {
  PoPageModule,
  PoButtonModule,
  PoI18nModule,
  PoI18nConfig,
} from '@po-ui/ng-components';

import { PageNotFoundComponent } from './page-not-found.component';
import { corePt } from 'core/i18n/core-pt';

xdescribe('PageNotFoundComponent', () => {
  let component: PageNotFoundComponent;
  let fixture: ComponentFixture<PageNotFoundComponent>;

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
      core: {
        'pt-BR': corePt,
      },
    },
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PageNotFoundComponent],
      imports: [
        CommonModule,
        PoPageModule,
        PoButtonModule,
        PoI18nModule.config(i18nConfig),
      ],
      providers: [{ provide: Router, useValue: mockRouter }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve redirecionar para a página inicial do monitor de eventos do reinf', () => {
    component.redirection();
    fixture.detectChanges();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/eventsMonitor']);
  });
});
