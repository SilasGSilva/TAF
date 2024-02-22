import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IrrfComponent } from './irrf.component';

xdescribe(IrrfComponent.name, () => {
  let component: IrrfComponent;
  let fixture: ComponentFixture<IrrfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IrrfComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IrrfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
