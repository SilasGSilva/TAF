import { TestBed } from '@angular/core/testing';
import { PoI18nConfig, PoI18nModule } from '@po-ui/ng-components';
import { corePt } from './core-pt';

import { LiteralService } from './literal.service';

xdescribe('LiteralService', () => {

  let service: LiteralService;
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
      providers: [LiteralService],
    });

    service = TestBed.inject(LiteralService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
