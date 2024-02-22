import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FgtsComponent } from './fgts.component';
import { PoPageModule } from '@po-ui/ng-components';
import { BrowserModule } from '@angular/platform-browser';
import { FgtsReportFilterModule } from './fgts-report-filter/fgts-report-filter.module';
import { FgtsReportCardModule } from './fgts-report-card/fgts-report-card.module';
import { FgtsReportProgressModule } from './fgts-report-progress/fgts-report-progress.module';
import { FgtsReportTableModule } from './fgts-report-table/fgts-report-table.module';
import { CoreModule } from 'core/core.module';
import { MasksPipe } from 'shared/pipe/masks.pipe';
import { LiteralService } from 'core/i18n/literal.service';
import { RouterTestingModule } from '@angular/router/testing';

xdescribe('FgtsComponent', () => {
  let component: FgtsComponent;
  let fixture: ComponentFixture<FgtsComponent>;

  beforeEach( () => {
    TestBed.configureTestingModule({
      declarations: [FgtsComponent],
      imports: [
        BrowserModule,
        FgtsReportFilterModule,
        FgtsReportCardModule,
        FgtsReportProgressModule,
        FgtsReportTableModule,
        PoPageModule,
        CoreModule,
        RouterTestingModule,
      ],
      providers: [MasksPipe, LiteralService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FgtsComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  xit('should create', () => {

    fixture = TestBed.createComponent(FgtsComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  xit('Executa a função showMoreRegisters', () => {
    component.showMoreRegisters(true);

    fixture.detectChanges();

    expect(component.showMore).toBeTruthy();
  });

  xit('Executa a função loadBar com valor igual a 100', () => {
    component.progressBarValue = 0;
    component.loadBar(100);
    fixture.detectChanges();

    expect(component.progressBarValue).toEqual(100);
  });

  xit('Executa a função loadBar com valor menor que 100', () => {
    component.progressBarValue = 0;
    component.loadBar(99);
    fixture.detectChanges();

    expect(component.progressBarValue).toEqual(99);
  });

  xit('Executa a função reset', () => {
    component.reset();
    fixture.detectChanges();

    expect(component.progressBarValue).toBeUndefined();
  });

  xit('Executa a função getPageLink', () => {
    component.pageLink = '/fgtsReport';
    const mockPageLink = component.getPageLink();

    fixture.detectChanges();

    expect(component.pageLink).toEqual(mockPageLink);
  });

  xit('Executa a função discardReport passando true', () => {
    component.disabledInputs = true;
    component.discardReport();
    fixture.detectChanges();

    expect(component.discardReport).toBeTruthy();
  });

  xit('Executa a função discardReport passando false', () => {
    component.disabledInputs = false;
    component.discardReport();
    fixture.detectChanges();

    expect(component.discardReport).toBeTruthy();
  });
});
