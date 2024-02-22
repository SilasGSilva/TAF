import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LalurComponent } from './lalur.component';

describe('LalurComponent', () => {
  let component: LalurComponent;
  let fixture: ComponentFixture<LalurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LalurComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LalurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
