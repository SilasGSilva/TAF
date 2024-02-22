import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GeneralComponent } from './general.component';

xdescribe('GeneralComponent', () => {
  let component: GeneralComponent;
  let fixture: ComponentFixture<GeneralComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
