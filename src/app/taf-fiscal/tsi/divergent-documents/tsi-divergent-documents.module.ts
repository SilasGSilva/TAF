import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from 'core/core.module';
import { TsiMonitorModule } from '../monitor/tsi-monitor.module';
import { PoButtonModule, PoPageModule, PoTableModule, PoTooltipModule } from '@po-ui/ng-components';
import { TsiDivergentDocumentsComponent } from './tsi-divergent-documents.component';
import { TsiDivergentDocumentsTableComponent } from './table/tsi-divergent-documents-table.component';
import { TsiDivergentDocumentsTableService } from './table/tsi-divergent-documents-table.service';
import { DialogYesNoModule } from 'shared/dialog-yes-no/dialog-yes-no-module';
import { MessengerModule } from 'shared/messenger/messenger.module';

@NgModule({
  exports: [TsiDivergentDocumentsComponent,
    TsiDivergentDocumentsTableComponent],
  providers: [TsiDivergentDocumentsTableService],
  declarations: [TsiDivergentDocumentsComponent,
    TsiDivergentDocumentsTableComponent,],
  imports: [CommonModule,
    TsiMonitorModule,
    MessengerModule,
    PoPageModule,
    PoButtonModule,
    CoreModule,
    PoTableModule,
    PoTooltipModule,
    DialogYesNoModule ],
})
export class DivergentDocumentsModule { }
