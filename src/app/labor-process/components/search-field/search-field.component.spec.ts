import { SearchFieldComponent } from './search-field.component';

describe('SearchFieldComponent', () => {
  let component: SearchFieldComponent;

  beforeEach(() => {
    component = new SearchFieldComponent();
  });

  it('should create', () => {
    void expect(component).toBeTruthy();
    void expect(component.placeholder).toBeUndefined();
    void expect(component.showAdvancedSearch).toBeFalse();
    void expect(component.disabled).toBeFalse();
    void expect(component.label).toBeUndefined();
    void expect(component.readonly).toBeFalse();
  });

  describe('value', () => {
    it('get deve retornar valor de pValue', () => {
      component['pValue'] = 'search value';
      void expect(component.value).toEqual('search value');
    });

    it('set deve chamar setSearchValue', () => {
      spyOn<any>(component, 'setSearchValue').and.stub();
      component.value = 'search value';
      void expect(component['setSearchValue']).toHaveBeenCalledOnceWith(
        'search value'
      );
    });
  });

  describe('setSearchValue', () => {
    it('deve setar undefined em pValue quando value igual vazio', () => {
      component['setSearchValue']('');
      void expect(component['pValue']).toBeUndefined();
    });

    it('deve setar alterar pValue quando valor for diferente do atual', () => {
      component['pValue'] = 'search';
      component['setSearchValue']('search value');
      void expect(component['pValue']).toEqual('search value');
    });
  });

  it('onSubmit deve emitir evento search com valor pesquisado', () => {
    component['pValue'] = 'search value';
    spyOn(component.search, 'emit').and.stub();
    component.onSubmit();
    void expect(component.search.emit).toHaveBeenCalledOnceWith('search value');
  });
});
