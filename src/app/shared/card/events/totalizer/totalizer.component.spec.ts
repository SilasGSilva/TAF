import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TotalizerComponent } from './totalizer.component';

xdescribe('TotalizerComponent', () => {
  let component: TotalizerComponent;
  let fixture: ComponentFixture<TotalizerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TotalizerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
