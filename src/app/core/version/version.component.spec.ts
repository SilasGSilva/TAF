import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VersionComponent } from './version.component';
import { PoModalModule } from '@po-ui/ng-components';

xdescribe('VersionComponent', () => {
  let component: VersionComponent;
  let fixture: ComponentFixture<VersionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VersionComponent ],
      imports: [PoModalModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve exibir o modal contendo a versão informada', () => {

    const spy = spyOn(component.versionModal, 'open');

    component.show('v12.1.25-1.5.7');

    fixture.detectChanges();

    expect(component.version).toBe('v12.1.25-1.5.7');
    expect(spy).toHaveBeenCalled();

  });
});
