import { DatePipe } from '@angular/common';
import { CatPrintReportService } from './../cat-report/services/cat-print-report.service';
import {
  ComponentFixture,
  TestBed,
  waitForAsync
} from '@angular/core/testing';
import {
  PoI18nConfig,
  PoI18nModule,
  PoI18nPipe,
} from '@po-ui/ng-components';
import { tafSocialPt } from 'core/i18n/taf-social-pt';
import { SocialListBranchService } from '../../services/social-list-branch/social-list-branch.service';
import { SocialListEventService } from '../../services/social-list-event/social-list-event.service';
import { CatFilterComponent } from './cat-filter.component';
import { CatFilterModule } from './cat-filter.module';
import { CatServices } from './services/cat.service';

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
const branch: Array<string> = ['D MG 01', 'D RJ 02', 'M PR 02'];
const event: Array<string> = ['S-1202'];
const transmission: Array<string> = ['1', '2'];
const deadline: Array<string> = ['1', '2'];
const period = '202112';
const periodFrom = '2021-12-01';
const periodTo = '2021-12-31';

xdescribe(CatFilterComponent.name, () => {
  let component: CatFilterComponent = null;
  let fixture: ComponentFixture<CatFilterComponent> = null;
  let catServices: CatServices = null;
  let eventService: SocialListEventService = null;
  let branchService: SocialListBranchService = null;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          CatFilterModule,
          PoI18nModule.config(i18nConfig)
        ],
        providers: [
          CatServices,
          CatPrintReportService,
          PoI18nPipe,
          DatePipe,
          SocialListBranchService,
          SocialListEventService
        ]
      }).compileComponents();

      const TAFCompany = {
        company_code: 'T1',
        branch_code: 'D MG 01',
      };
      const tafFull = true;
      const tafContext = 'esocial';
  
      sessionStorage.setItem('TAFCompany', JSON.stringify(TAFCompany));
      sessionStorage.setItem('TAFFull', JSON.stringify(tafFull));
      sessionStorage.setItem('TAFContext', tafContext);
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CatFilterComponent);
    component = fixture.componentInstance;
    catServices = TestBed.inject(CatServices);
    eventService = TestBed.inject(SocialListEventService);
    branchService = TestBed.inject(SocialListBranchService);
  });

  it(`deve criar o componente ${CatFilterComponent.name}`, () => {
    expect(component).toBeTruthy();
  });
});
