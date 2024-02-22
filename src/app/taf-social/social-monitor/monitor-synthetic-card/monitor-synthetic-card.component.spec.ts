import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PoWidgetModule } from '@po-ui/ng-components';

import { MonitorSyntheticCardComponent } from './monitor-synthetic-card.component';

xdescribe('MonitorSyntheticCardComponent', () => {
  let component: MonitorSyntheticCardComponent;
  let fixture: ComponentFixture<MonitorSyntheticCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitorSyntheticCardComponent ],
      imports: [PoWidgetModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitorSyntheticCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve ser criado', () => {
    expect(component).toBeTruthy();
  });
});
