import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed, fakeAsync, tick, getTestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { PoPageModule, PoModule, PoButtonModule, PoNotificationService } from '@po-ui/ng-components';
import { PoCodeEditorModule } from '@po-ui/ng-code-editor';
import { ProtheusLibCoreModule } from '@totvs/protheus-lib-core';
import { CoreModule } from './../../core/core.module';
import { LiteralService } from './../../core/i18n/literal.service';
import { EditorXMLComponent } from './editor-xml.component';
import { EditorXmlService } from './editor-xml.service';

xdescribe('EditorXMLComponent', () => {
  let component: EditorXMLComponent;
  let fixture: ComponentFixture<EditorXMLComponent>;
  let originalTimeOut: number;
  let injector: TestBed;
  let editorXmlService: EditorXmlService;
  let poNotificationService: PoNotificationService;

  beforeEach(waitForAsync(() => {
    const TAFCompany = {
      company_code: 'T1',
      branch_code: 'D MG 01',
    };
    const company = JSON.stringify(TAFCompany);

    const TAFBusiness = { user: '000001', eSocialXmlId: 'TAFKEY_123456' };
    const business = JSON.stringify(TAFBusiness);

    sessionStorage.setItem('TAFCompany', company);
    sessionStorage.setItem('TAFContext', 'editorXML');
    sessionStorage.setItem('TAFBusiness', business);
    sessionStorage.setItem('ERPAPPCONFIG', '{"productLine":"Protheus"}');

    originalTimeOut = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 800000;

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        PoPageModule,
        PoModule,
        CoreModule,
        ProtheusLibCoreModule,
        CommonModule,
        FormsModule,
        PoButtonModule,
        PoCodeEditorModule,
        CoreModule,
      ],
      declarations: [EditorXMLComponent],
      providers: [
        LiteralService,
        EditorXmlService,
        PoNotificationService,
      ],
    }).compileComponents();

    injector = getTestBed();

    editorXmlService = injector.get(EditorXmlService);
    poNotificationService = injector.get(PoNotificationService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorXMLComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeOut;
    sessionStorage.removeItem('TAFContext');
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar o xml para edição', fakeAsync(() => {
    const mockEsocialXMLMessage = {
      xmlType: 'S-1010',
      xmlMessage:
        'PD94bWwgdmVyc2lvbj0nMS4wJyBlbmNvZGluZz0ndXRmLTgnPz48ZVNvY2lhbCB4bWxucz0naHR0cDovL3d3dy5lc29jaWFsLmdvdi5ici9zY2hlbWEvZXZ0L2V2dFRhYlJ1YnJpY2EvdjAyXzA1XzAwJz48ZXZ0VGFiUnVicmljYSBJZD0nSUQxMjcyMzExODUwMDAwMDAyMDE5MDUwNjEyMDMxODA1NTI1Jz48aWRlRXZlbnRvPjx0cEFtYj4yPC90cEFtYj48cHJvY0VtaT4xPC9wcm9jRW1pPjx2ZXJQcm9jPjEuMDwvdmVyUHJvYz48L2lkZUV2ZW50bz48aWRlRW1wcmVnYWRvcj48dHBJbnNjPjE8L3RwSW5zYz48bnJJbnNjPjI3MjMxMTg1PC9uckluc2M+PC9pZGVFbXByZWdhZG9yPjwvZXZ0VGFiUnVicmljYT48L2VTb2NpYWw+',
    };

    spyOn(editorXmlService, 'getXmlEdit').and.returnValue(
      of(mockEsocialXMLMessage)
    );

    component.ngOnInit();
    tick(80000);

    expect(component.code).toBeDefined();
    expect(component.hashCode).toBeDefined();
  }));

  it('deve retornar o link da página corretamente', fakeAsync(() => {
    const mockPageLink = '/editorXML';

    component.getPageLink();
    tick();

    expect(component.pageLink).toEqual(mockPageLink);
  }));

  it('deve retornar o MD5 correto', fakeAsync(() => {
    const mockHashCode = '654e550fee51039cd838b01af2423352';
    const mockCode =
      'PD94bWwgdmVyc2lvbj0nMS4wJyBlbmNvZGluZz0ndXRmLTgnPz48ZVNvY2lhbCB4bWxucz0naHR0cDovL3d3dy5lc29jaWFsLmdvdi5ici9zY2hlbWEvZXZ0L2V2dFRhYlJ1YnJpY2EvdjAyXzA1XzAwJz48ZXZ0VGFiUnVicmljYSBJZD0nSUQxMjcyMzExODUwMDAwMDAyMDE5MDUwNjEyMDMxODA1NTI1Jz48aWRlRXZlbnRvPjx0cEFtYj4yPC90cEFtYj48cHJvY0VtaT4xPC9wcm9jRW1pPjx2ZXJQcm9jPjEuMDwvdmVyUHJvYz48L2lkZUV2ZW50bz48aWRlRW1wcmVnYWRvcj48dHBJbnNjPjE8L3RwSW5zYz48bnJJbnNjPjI3MjMxMTg1PC9uckluc2M+PC9pZGVFbXByZWdhZG9yPjwvZXZ0VGFiUnVicmljYT48L2VTb2NpYWw+';

    component.code = component.prettifyXml(atob(mockCode));
    component.hashCode = mockHashCode;

    component.onEditXml();

    tick(10000);
    expect(component.isButtonSaveDisabled).toBeTruthy();
  }));

  it('deve retornar o MD5 incorreto', fakeAsync(() => {
    const mockHashCode = '654e550fee51039cd838b01af2423353';
    const mockCode =
      'PD94bWwgdmVyc2lvbj0nMS4wJyBlbmNvZGluZz0ndXRmLTgnPz48ZVNvY2lhbCB4bWxucz0naHR0cDovL3d3dy5lc29jaWFsLmdvdi5ici9zY2hlbWEvZXZ0L2V2dFRhYlJ1YnJpY2EvdjAyXzA1XzAwJz48ZXZ0VGFiUnVicmljYSBJZD0nSUQxMjcyMzExODUwMDAwMDAyMDE5MDUwNjEyMDMxODA1NTI1Jz48aWRlRXZlbnRvPjx0cEFtYj4yPC90cEFtYj48cHJvY0VtaT4xPC9wcm9jRW1pPjx2ZXJQcm9jPjEuMDwvdmVyUHJvYz48L2lkZUV2ZW50bz48aWRlRW1wcmVnYWRvcj48dHBJbnNjPjE8L3RwSW5zYz48bnJJbnNjPjI3MjMxMTg1PC9uckluc2M+PC9pZGVFbXByZWdhZG9yPjwvZXZ0VGFiUnVicmljYT48L2VTb2NpYWw+';

    component.code = component.prettifyXml(atob(mockCode));
    component.hashCode = mockHashCode;
    
    component.onEditXml();

    tick(10000);
    expect(component.isButtonSaveDisabled).toBeFalsy();
  }));

  it('deve salvar o xml editado', fakeAsync(() => {
    const mockCode =
      'PD94bWwgdmVyc2lvbj0nMS4wJyBlbmNvZGluZz0ndXRmLTgnPz48ZVNvY2lhbCB4bWxucz0naHR0cDovL3d3dy5lc29jaWFsLmdvdi5ici9zY2hlbWEvZXZ0L2V2dFRhYlJ1YnJpY2EvdjAyXzA1XzAwJz48ZXZ0VGFiUnVicmljYSBJZD0nSUQxMjcyMzExODUwMDAwMDAyMDE5MDUwNjEyMDMxODA1NTI1Jz48aWRlRXZlbnRvPjx0cEFtYj4yPC90cEFtYj48cHJvY0VtaT4xPC9wcm9jRW1pPjx2ZXJQcm9jPjEuMDwvdmVyUHJvYz48L2lkZUV2ZW50bz48aWRlRW1wcmVnYWRvcj48dHBJbnNjPjE8L3RwSW5zYz48bnJJbnNjPjI3MjMxMTg1PC9uckluc2M+PC9pZGVFbXByZWdhZG9yPjwvZXZ0VGFiUnVicmljYT48L2VTb2NpYWw+';
    const mockResponse = {
      message: 'Processo realizado com sucesso',
      success: true,
    };
    const spyEdit = spyOn(editorXmlService, 'saveXmlEdit').and.returnValue(
      of(mockResponse)
    );

    component.code = mockCode;
    component.saveXml();

    tick(30000);

    expect(spyEdit).toHaveBeenCalled();
  }));
});
