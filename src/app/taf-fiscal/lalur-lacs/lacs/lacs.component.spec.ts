import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LacsComponent } from './lacs.component';

describe('LacsComponent', () => {
  let component: LacsComponent;
  let fixture: ComponentFixture<LacsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LacsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LacsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
