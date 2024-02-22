import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TableDetailsSecondLevelComponent } from './table-details-second-level.component';

xdescribe('TableDetailsSecondLevelComponent', () => {
  let component: TableDetailsSecondLevelComponent;
  let fixture: ComponentFixture<TableDetailsSecondLevelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TableDetailsSecondLevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableDetailsSecondLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
