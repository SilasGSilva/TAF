import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  PoPageModule,
  PoButtonModule,
  PoModalModule,
  PoFieldModule,
} from '@po-ui/ng-components';
import { PoCodeEditorModule } from '@po-ui/ng-code-editor';

import { CoreModule } from 'core/core.module';
import { EditorXMLRoutingModule } from './editor-xml.routing.module';
import { EditorXMLComponent } from './editor-xml.component';

@NgModule({
  declarations: [EditorXMLComponent],
  imports: [
    CommonModule,
    FormsModule,
    PoPageModule,
    PoButtonModule,
    PoCodeEditorModule,
    CoreModule,
    EditorXMLRoutingModule,
    PoModalModule,
    PoFieldModule,
  ],
  exports: [EditorXMLComponent],
})
export class EditorXMLModule {}
