import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DialogYesNoComponent } from './dialog-yes-no.component';
import { PoModalModule } from '@po-ui/ng-components';

xdescribe('DialogYesNoComponent', () => {
  let component: DialogYesNoComponent;
  let fixture: ComponentFixture<DialogYesNoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PoModalModule],
      declarations: [DialogYesNoComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogYesNoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
