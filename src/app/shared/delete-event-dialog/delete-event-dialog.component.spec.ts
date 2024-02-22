import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DeleteEventDialogComponent } from './delete-event-dialog.component';
import { PoModalModule } from '@po-ui/ng-components';

xdescribe('DeleteEventDialogComponent', () => {
  let component: DeleteEventDialogComponent;
  let fixture: ComponentFixture<DeleteEventDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PoModalModule],
      declarations: [DeleteEventDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteEventDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
