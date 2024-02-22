import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuditProgressComponent } from './audit-progress.component';
import { PoProgressModule } from '@po-ui/ng-components';

xdescribe(AuditProgressComponent.name, () => {
  let component: AuditProgressComponent;
  let fixture: ComponentFixture<AuditProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuditProgressComponent],
      imports: [PoProgressModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it(`deve criar o componente ${AuditProgressComponent.name}`, () => {
    expect(component).toBeTruthy();
  });
});
