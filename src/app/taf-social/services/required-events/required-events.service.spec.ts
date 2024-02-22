import { TestBed } from '@angular/core/testing';
import { PoI18nConfig, PoI18nModule } from '@po-ui/ng-components';
import { corePt } from 'core/i18n/core-pt';
import { RequiredEventsService } from './required-events.service';

xdescribe('RequiredEventsService', () => {

  let service: RequiredEventsService;

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

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PoI18nModule.config(i18nConfig)],
      providers: [RequiredEventsService]
    });

    service = TestBed.inject(RequiredEventsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});