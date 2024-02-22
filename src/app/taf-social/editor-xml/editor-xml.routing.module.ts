import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

import { PageNotFoundComponent } from 'core/errors/page-not-found/page-not-found.component';
import { EditorXMLComponent } from './editor-xml.component';

const tafSocialRoutes: Routes = [
    { path: 'editorXML',
      children: [
        { path: ''    , component: EditorXMLComponent },
        { path: '**'  , component: PageNotFoundComponent }
      ]
    }
  ];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(tafSocialRoutes)],
  exports: [RouterModule]
})

export class EditorXMLRoutingModule {}
