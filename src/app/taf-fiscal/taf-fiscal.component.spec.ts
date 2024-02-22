import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TafFiscalComponent } from './taf-fiscal.component';

xdescribe('TafFiscalComponent', () => {
  let component: TafFiscalComponent;
  let fixture: ComponentFixture<TafFiscalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TafFiscalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TafFiscalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
