import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VmessageComponent } from './vmessage.component';

xdescribe('VmessageComponent', () => {
  let component: VmessageComponent;
  let fixture: ComponentFixture<VmessageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VmessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VmessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve ser criado', () => {
    expect(component).toBeTruthy();
  });
});
