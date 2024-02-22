import { TestBed } from '@angular/core/testing';

import { CoreModule } from 'core/core.module';
import { LiteralService } from 'core/i18n/literal.service';
import { FgtsReportTableService } from './fgts-report-table.service';

xdescribe('FgtsReportTableService', () => {

  let service: FgtsReportTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FgtsReportTableService, LiteralService],
      imports: [CoreModule]
    });

    service = TestBed.get(FgtsReportTableService);

  });

  it('deve criar o serviço de tabela do relatório de FGTS', () => {
    expect(service).toBeTruthy();
  });

});
