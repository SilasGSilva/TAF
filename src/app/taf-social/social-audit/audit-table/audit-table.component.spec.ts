import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PoI18nConfig, PoI18nModule, PoI18nPipe } from '@po-ui/ng-components';
import { tafSocialPt } from './../../../core/i18n/taf-social-pt';
import { AuditTableModule } from './audit-table.module';
import { AuditService } from './../audit-filter/services/audit.service';
import { AuditTableComponent } from './audit-table.component';

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

xdescribe(AuditTableComponent.name, () => {
  let component: AuditTableComponent = null;
  let fixture: ComponentFixture<AuditTableComponent> = null;
  let auditService: AuditService = null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AuditTableModule,
        RouterTestingModule,
        PoI18nModule.config(i18nConfig)
      ],
      providers: [
        AuditService,
        PoI18nPipe
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AuditTableComponent);
    component = fixture.componentInstance;
    auditService = TestBed.inject(AuditService);
  });

  it(`deve criar o componente ${AuditTableComponent.name}`, () => {
    expect(component).toBeTruthy();
  });
});
