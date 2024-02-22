import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SmartViewHeaderComponent } from './sv-header.component';

xdescribe('SmartViewHeaderComponent', () => {
  let component: SmartViewHeaderComponent;
  let fixture: ComponentFixture<SmartViewHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmartViewHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmartViewHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
