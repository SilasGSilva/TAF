import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveCompanyComponent } from './remove-company.component';

xdescribe('RemoveCompanyComponent', () => {
  let component: RemoveCompanyComponent;
  let fixture: ComponentFixture<RemoveCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemoveCompanyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
