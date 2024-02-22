import { TestBed } from '@angular/core/testing';
import { ReportFilterCategoriesService } from './report-filter-categories.service';

describe(ReportFilterCategoriesService.name, () => {
  let service: ReportFilterCategoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReportFilterCategoriesService]
    });

    service = TestBed.get(ReportFilterCategoriesService);
  });

  it(`deve criar o serviço ${ReportFilterCategoriesService.name}`, () => {
    expect(service).toBeTruthy();
  });

  it(`#${ReportFilterCategoriesService.prototype.getCategories.name}
    deve realizar a chamada do serviço e retornar os dados corretamente`, () => {
    const mockGetCategoryResponse = [
      { value: '101', label: '101' },
      { value: '102', label: '102' },
      { value: '103', label: '103' },
      { value: '104', label: '104' },
      { value: '105', label: '105' },
      { value: '106', label: '106' },
      { value: '107', label: '107' },
      { value: '108', label: '108' },
      { value: '111', label: '111' },
      { value: '201', label: '201' },
      { value: '202', label: '202' },
      { value: '203', label: '203' },
      { value: '301', label: '301' },
      { value: '302', label: '302' },
      { value: '303', label: '303' },
      { value: '304', label: '304' },
      { value: '305', label: '305' },
      { value: '306', label: '306' },
      { value: '307', label: '307' },
      { value: '308', label: '308' },
      { value: '309', label: '309' },
      { value: '401', label: '401' },
      { value: '410', label: '410' },
      { value: '701', label: '701' },
      { value: '702', label: '702' },
      { value: '703', label: '703' },
      { value: '704', label: '704' },
      { value: '711', label: '711' },
      { value: '712', label: '712' },
      { value: '713', label: '713' },
      { value: '721', label: '721' },
      { value: '722', label: '722' },
      { value: '723', label: '723' },
      { value: '731', label: '731' },
      { value: '732', label: '732' },
      { value: '733', label: '733' },
      { value: '734', label: '734' },
      { value: '735', label: '735' },
      { value: '736', label: '736' },
      { value: '738', label: '738' },
      { value: '741', label: '741' },
      { value: '751', label: '751' },
      { value: '761', label: '761' },
      { value: '771', label: '771' },
      { value: '781', label: '781' },
      { value: '901', label: '901' },
      { value: '902', label: '902' },
      { value: '903', label: '903' },
      { value: '904', label: '904' },
      { value: '905', label: '905' }
    ];

    const resultGetCategory = service.getCategories();
    expect(resultGetCategory).toEqual(mockGetCategoryResponse);
  });
});
