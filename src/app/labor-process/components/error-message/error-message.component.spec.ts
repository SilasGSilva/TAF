import { ErrorMessageComponent } from './error-message.component';

describe('ErrorMessageComponent', () => {
  let component: ErrorMessageComponent;

  beforeEach(() => {
    component = new ErrorMessageComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shouldAnimate deve setar valor em animationsDisabled', () => {
    component.shouldAnimate = true;
    void expect(component.animationsDisabled).toBeFalse();
  });
});
