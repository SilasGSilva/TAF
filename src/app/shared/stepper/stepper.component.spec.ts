import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PoModule, PoBreadcrumbItem, PoBreadcrumbModule } from '@po-ui/ng-components';

import { StepperComponent } from './stepper.component';
import { RouterTestingModule } from '@angular/router/testing';

xdescribe('StepperComponent', () => {
  let component: StepperComponent;
  let fixture: ComponentFixture<StepperComponent>;
  const inputItems: Array<PoBreadcrumbItem> = [
    { label: 'Bar Route', link: '/bar' },
    { label: 'Foo Route', link: '/foo' }
  ];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StepperComponent ],
      imports: [
        PoModule,
        PoBreadcrumbModule,
        RouterTestingModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepperComponent);
    component = fixture.componentInstance;
    component.stepperItems = inputItems;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
