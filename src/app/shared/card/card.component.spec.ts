import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PoContainerModule } from '@po-ui/ng-components';

import { CardComponent } from './card.component';

xdescribe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CardComponent ],
      imports: [ PoContainerModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve ser criado o componente', () => {
    expect(component).toBeTruthy();
  });
});
