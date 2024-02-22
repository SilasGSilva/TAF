import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CoreModule } from 'core/core.module';
import { LiteralService } from 'core/i18n/literal.service';
import { SocialRestrictionListEventService } from './social-restriction-list-event.service';

xdescribe('SocialRestrictionListEventService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SocialRestrictionListEventService, LiteralService],
      imports: [HttpClientTestingModule, CoreModule],
    });
  });
});
