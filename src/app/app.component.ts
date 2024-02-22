import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router
  ) {}

  public menuContext = '';

  ngOnInit(): void {
    this.menuContext = sessionStorage.getItem('TAFContext');

    this.load();
  }

  nav(routeName: String) {
    this.router.navigate([routeName]);
  }

  load() {
    const proAppConfig = JSON.parse(sessionStorage.getItem('ERPAPPCONFIG'));
    const productLine = proAppConfig.productLine.toLowerCase();

    if (!this.menuContext) {
      if (productLine === 'datasul' || productLine === 'rm') {
        if (!sessionStorage.getItem('TAFFeatures')) {
          sessionStorage.setItem(
            'TAFFeatures',
            JSON.stringify({
              downloadXLS: { access: true, message: 'RGlzcG9u7XZlbC4=' },
            })
          );
        }

        if (!sessionStorage.getItem('TAFFull')) {
          sessionStorage.setItem('TAFFull', JSON.stringify(false));
        }

        this.menuContext = 'marcas';
      }
    }

    if (!environment.useHash) {
      if (this.menuContext === 'reinf') {
        this.nav('/eventsMonitor');
      } else if (this.menuContext === 'esocial') {
        this.nav('/socialMonitor');
      } else if (this.menuContext === 'gpe') {
        this.nav('/socialMonitor');
      } else if (this.menuContext === 'editorXML') {
        this.nav('/editorXML');
      } else if (this.menuContext === 'marcas') {
        this.nav('/inssReport');
      } else if (this.menuContext === 'labor-process') {
        this.nav('/labor-process');
      } else if (this.menuContext === 'lalurlacs') {
        this.nav('/lalurlacs');
      }
    }
  }
}
