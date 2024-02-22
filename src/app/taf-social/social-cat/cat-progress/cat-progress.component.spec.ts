import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CatProgressComponent } from './cat-progress.componet';

xdescribe(CatProgressComponent.name, () => {
  let component: CatProgressComponent;
  let fixture: ComponentFixture<CatProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatProgressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CatProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it(`deve criar o componente ${CatProgressComponent.name}`, () => {
    expect(component).toBeTruthy();
  });
});
