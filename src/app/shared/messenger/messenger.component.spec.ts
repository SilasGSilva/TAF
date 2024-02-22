import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MessengerComponent } from './messenger.component';
import { PoModalModule } from '@po-ui/ng-components';

xdescribe('MessengerComponent', () => {
  let component: MessengerComponent;
  let fixture: ComponentFixture<MessengerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PoModalModule],
      declarations: [MessengerComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessengerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
