import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TafSocialComponent } from './taf-social.component';

xdescribe('TafSocialComponent', () => {
  let component: TafSocialComponent;
  let fixture: ComponentFixture<TafSocialComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TafSocialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TafSocialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
