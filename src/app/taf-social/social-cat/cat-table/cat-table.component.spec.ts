import { DatePipe } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PoI18nConfig, PoI18nModule, PoI18nPipe } from '@po-ui/ng-components';
import { tafSocialPt } from '../../../core/i18n/taf-social-pt';
import { CatTableModule } from './cat-table.module';
import { CatServices } from '../cat-filter/services/cat.service';
import { CatTableComponent } from './cat-table.component';

const i18nConfig: PoI18nConfig = {
  default: {
    language: 'pt-BR',
    context: 'general',
    cache: true,
  },
  contexts: {
    tafSocial: {
      'pt-BR': tafSocialPt,
    },
  },
};

xdescribe(CatTableComponent.name, () => {
  let component: CatTableComponent = null;
  let fixture: ComponentFixture<CatTableComponent> = null;
  let catServices: CatServices = null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CatTableModule,
        RouterTestingModule,
        PoI18nModule.config(i18nConfig)
      ],
      providers: [
        CatServices,
        PoI18nPipe,
        DatePipe
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CatTableComponent);
    component = fixture.componentInstance;
    catServices = TestBed.inject(CatServices);
  });

  it(`deve criar o componente ${CatTableComponent.name}`, () => {
    expect(component).toBeTruthy();
  });
});
