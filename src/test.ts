// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

declare const require: any;

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(), {
    teardown: { destroyAfterEach: false }
}
);
// Then we find all the tests.
const context = require.context('./', true, /\.spec\.ts$/);
//const context = require.context('./', true, /tsi-header.component\.spec\.ts$/); //Utilizar quando quiser testar apenas um componente
//const context = require.context('./', true, /tsi-monitor.component\.spec\.ts$/); //Utilizar quando quiser testar apenas um componente
//const context = require.context('./', true, /tsi-divergent-documents.component\.spec\.ts$/); //Utilizar quando quiser testar apenas um componente
//const context = require.context('./', true, /tsi-divergent-documents-table.component\.spec\.ts$/); //Utilizar quando quiser testar apenas um componente

// And load the modules.
context.keys().map(context);
