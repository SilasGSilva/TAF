import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormBuilder, Validators, AbstractControl, UntypedFormGroup, ValidatorFn, } from '@angular/forms';
import { EMPTY } from 'rxjs';
import { expand } from 'rxjs/operators';
import { PoMultiselectOption } from '@po-ui/ng-components';
import { LiteralService } from 'core/i18n/literal.service';
import { SocialUserFilterService } from '../../../taf-social/services/social-user-filter/social-user-filter.service';
import { SocialListBranchService } from '../../services/social-list-branch/social-list-branch.service';
import { CatServices } from './services/cat.service';
import { CatEnvironmentService } from './services/cat-enviroment.service';
import { CatExecuteRequest } from '../social-cat-models/CatRequest';
import { CatStatusRequest } from '../social-cat-models/CatStatusRequest';
import { CatValuesRequest } from '../social-cat-models/CatValuesRequest';
import { CatValuesResponse } from '../social-cat-models/CatValuesResponse';
import { DisclaimerFilterCat } from '../social-cat-models/DisclaimerFilterCat';
import { BranchRequest } from './../../models/BranchRequest';

const { cpf } = require('cpf-cnpj-validator');

@Component({
  selector: 'app-cat-filter',
  templateUrl: './cat-filter.component.html',
  styleUrls: ['./cat-filter.component.scss']
})

export class CatFilterComponent implements OnInit, OnChanges {
  public cat: string;
  public cpf: string;
  public name: string;
  public cpfValid = true;
  public disableButton = true;
  public disabledInputs = false;
  public formFilterModal: UntypedFormGroup;
  public labelButtonFilter: string;
  public literals = {};
  public listBranch = new Array<PoMultiselectOption>();
  public loadFilter = false;
  public page = 1;
  public periodFrom = '^(19[0-9]{2}|2[0-9]{3})(0[1-9]|1[0-2])?$';
  public periodTo = '^(19[0-9]{2}|2[0-9]{3})(0[1-9]|1[0-2])?$';
  public selectedFilters = [];
  public formFilter: UntypedFormGroup = this.formBuilder.group({
    branch: ['', Validators.required],
    cpf: ['', this.isValidCpf()],
    name: [''],
    cat: [''],
    periodFrom: [''],
    periodTo: ['']
  });
  private companyId: string = this.CatEnvironmentService.getCompany();
  private requestId = '';

  @Input('disableButtonApplyFilters') disableButtonApplyFilters = true;
  @Input('isLoadingExecuteFilter') isLoadingExecuteFilter = false;
  @Input('showMore') showMore: boolean;
  @Output() execFilter = new EventEmitter();
  @Output('reset') reset = new EventEmitter();
  @Output('payloadCatTable') payloadCatTable = new EventEmitter<CatValuesResponse>();
  @Output('updateProgressBar') progressBar = new EventEmitter<number>();
  @ViewChild('nonAuthorizationAlert') nonAuthorizationAlert: ElementRef;

  constructor(
    private CatEnvironmentService: CatEnvironmentService,
    private catService: CatServices,
    private formBuilder: UntypedFormBuilder,
    private literalsService: LiteralService,
    private socialListBranchService: SocialListBranchService,
    private socialUserFilterService: SocialUserFilterService,
  ) {
    this.literals = this.literalsService.literalsTafSocial;
  }

  ngOnInit(): void {
    this.getBranches();
    this.labelButtonFilter = this.literals['socialCat']['executeFilter'];
  }

  ngOnChanges(): void {
    if (this.showMore) {
      const request = this.changeParamsGetTable(this.requestId, this.companyId);
      this.catService.postValuesCat(request).subscribe(response => {
        this.payloadCatTable.emit(response);
        this.showMore = undefined;
      });
    }
  }

  public onChangeBranchs(event?: Array<PoMultiselectOption>): void {
    const newSelectedFilters = this.selectedFilters;

    this.selectedFilters = [];

    if (event != undefined) {
      event.forEach(element => {
        this.selectedFilters.push({
          value: element.value,
          id: 'branch',
          label:
            this.literals['socialCat']['branchs'] + ': ' + element.value,
        });
      });
    }

    newSelectedFilters.forEach(element => {
      if (element.id != 'branch') {
        this.selectedFilters.push(element);
      }
    });
  }

  public onChangeCpfSelect(event: string, to: string): void {
    const position = this.positionArray('cpf', this.selectedFilters);
    let filterValid: Array<boolean>;

    filterValid = this.validFilters(event, 'cpf');
    this.disableButton = !filterValid[0];
    this.cpfValid = filterValid[1];

    if (this.formFilter && this.formFilter.get('cpf').errors === null) {
      if (position >= 0) {
        this.selectedFilters.splice(position, 1, {
          value: event,
          id: 'cpf',
          label: this.literals['socialCat']['cpf'] + ': ' + event,
        });
        this.selectedFilters = [...this.selectedFilters];
      } else {
        this.selectedFilters = [
          ... this.selectedFilters,
          {
            value: event,
            id: 'cpf',
            label: this.literals['socialCat']['cpf'] + ': ' + event,
          },
        ];
      }
    }
  }

  public onChangeName(event: string): void {
      const position = this.positionArray('name', this.selectedFilters);

      if ( position >= 0 ) {
        this.selectedFilters.splice(position, 1, {
          value:event,
          id: 'name',
          label: this.literals['socialCat']['name'] + ': ' + event,
        });
        this.selectedFilters = [... this.selectedFilters];
      } else {
        this.selectedFilters = [
          ...this.selectedFilters,
          {
            value: event,
            id: 'name',
            label: this.literals['socialCat']['name'] + ': ' + event,
          },
        ];
     }
  }

  public onChangeDisclaimerSelect(): void {
    let arrayBranchs = [];
    let cpf = ''
    let name = ''
    let cat = ''
    let findPeriodFrom = false;
    let findPeriodTo = false;
    let findBranch = false;
    let findCpf = false;
    let findName = false;
    let findCat = false;

    this.selectedFilters.forEach(element => {
        if (element.id === 'branch') {
        findBranch = true;
      } else if (element.id === 'cpf') {
        findCpf = true;
      } else if (element.id === 'name'){
        findName = true;
      } else if (element.id === 'cat'){
        findCat = true;
      } else if (element.id === 'periodFrom'){
        findPeriodFrom = true;
      } else if (element.id === 'periodTo'){
        findPeriodTo = true;
      }
    });

    if (!findBranch) {
      this.formFilter.patchValue({ branch: [''] });
    } else {
      arrayBranchs = this.selectedFilters.filter(
        element => element.id === 'branch'
      ).map(branch => branch.value);
      this.formFilter.patchValue({ branch: arrayBranchs });
    }

    if (!findCpf) {
      this.formFilter.patchValue({ cpf: undefined });
    } else {
      this.selectedFilters.map(element => {
        if (element.id === 'cpf') {
          cpf = element.value;
        }
      });
      this.formFilter.patchValue({ cpf: cpf });
    }

    if (!findName) {
      this.formFilter.patchValue({ name: undefined });
    } else {
      this.selectedFilters.map(element => {
        if (element.id === 'name') {
          name = element.value;
        }
      });
      this.formFilter.patchValue({ name: name });
    }

    if (!findCat) {
      this.formFilter.patchValue({ cat: undefined });
    } else {
      this.selectedFilters.map(element => {
        if (element.id === 'cat') {
          cat = element.value;
        }
      });
      this.formFilter.patchValue({ cat: cat });
    }

    if (!findPeriodFrom) {
      this.formFilter.patchValue({ periodFrom: undefined });
    } else {
      this.selectedFilters.map(element => {
        if (element.id === 'periodFrom') {
          this.formFilter.patchValue({
            periodFrom: element.value,
          });
        }
      });
    }

    if (!findPeriodTo) {
      this.formFilter.patchValue({ periodTo: undefined });
    } else {
      this.selectedFilters.map(element => {
        if (element.id === 'periodTo') {
          this.formFilter.patchValue({
            periodTo: element.value,
          });
        }
      });
    }

    if (findBranch) {
      this.disableButtonApplyFilters = false;
    } else {
      this.disableButtonApplyFilters = true;
    }
  }

  public onChangeCAT(event: string): void {
    const position = this.positionArray(
      'cat',
      this.selectedFilters
    );

    if (position >= 0) {
      this.selectedFilters.splice(position, 1, {
        value: event,
        id: 'cat',
        label: this.literals['socialCat']['cat'] + ': ' + event,
      });
      this.selectedFilters = [...this.selectedFilters];
    } else {
      this.selectedFilters = [
        ...this.selectedFilters,
        {
          value: event,
          id: 'cat',
          label: this.literals['socialCat']['cat'] + ': ' + event,
        },
      ];
    }
  }

  public onChangePeriod(event: string, periodType: string): void {
    const positionPeriod = this.positionArray(periodType, this.selectedFilters);

    if (event && periodType) {
      const year = event.substring(6, 10);
      const month = event.substring(3, 5);
      const day = event.substring(0, 2);

      if (positionPeriod >= 0) {
        this.selectedFilters.splice(positionPeriod, 1);
        this.selectedFilters.push({
          value: `${year}-${month}-${day}`,
          id: periodType,
          label: `${this.literals['socialCat'][periodType]} : ${event}`,
        });
      } else {
        this.selectedFilters.push({
          value: `${year}-${month}-${day}`,
          id: periodType,
          label: `${this.literals['socialCat'][periodType]} : ${event}`,
        });
      }
    } else if (positionPeriod >= 0) {
      this.selectedFilters.splice(positionPeriod, 1);
    }
  }

  public async applyFilter(): Promise<void> {
    const payload = this.formFilter.getRawValue();
    const payloadPost: CatExecuteRequest = {
      companyId: this.companyId,
      branches: payload.branch,
      cpf: payload.cpf?.replaceAll('.','').replace('-',''),
      name: payload.name,
      catNumber: payload.cat,
      periodFrom: payload.periodFrom?.replaceAll("-", ""),
      periodTo: payload.periodTo?.replaceAll("-", "")
    };
    let percent = 1;
    let finished = false;

    this.requestId = '';
    this.page = 1;
    this.loadFilter = true;
    this.disabledInputs = true;
    this.reset.emit();

    if (!this.requestId) {
      await this.catService.postExecutCat(payloadPost).toPromise().then(response => {
        this.requestId = response.requestId;
        this.progressBar.emit(percent);
      });
    }

    const intervalTimeOut = 3000;
    const interval = setInterval(() => {
      if (this.requestId) {
        this.selectedFilters.forEach(element => (element.hideClose = true));

        if (percent < 100) {
          this.catService.getStatusCat(this.changeParamsGet(this.requestId, this.companyId))
            .subscribe(response => {
              finished = response.finished;
              percent = response.percent;

              this.progressBar.emit(percent);
            });
        } else {
          if (percent === 100 && finished) {
            const request = this.changeParamsGetTable(this.requestId, this.companyId);

            this.catService.postValuesCat(request).subscribe(response => {
              this.payloadCatTable.emit(response);
            });
          }

          this.selectedFilters.forEach(element => (element.hideClose = false));
          this.loadFilter = false;
          this.disabledInputs = false;
          clearInterval(interval);
        }
      } else {
        this.selectedFilters.forEach(element => (element.hideClose = false));

        this.loadFilter = false;
        this.disabledInputs = false;

        clearInterval(interval);
      }
    }, intervalTimeOut);
  }

  public positionArray(id: string, array: Array<DisclaimerFilterCat>): number {
    let position: number = 0;

    if (array.length > 0) {
      position = array.findIndex(element => {
        return id === element.id;
      });
    }
    return position;
  }

  public validFilters(
    event: string = '',
    filter: string = ''
  ): Array<boolean> {
    let taxNumber = true;

     if (filter === 'cpf') {
      taxNumber = event ? cpf.isValid(event) : true;

      return [taxNumber];
    }
  }

  public saveParams(selectedFilter: DisclaimerFilterCat[]): void {
    this.socialUserFilterService.setUserFilter(selectedFilter);
  }

  public validateRequiredFields(): void {
    if (this.formFilter.invalid) {
      this.disableButtonApplyFilters = true;
    } else {
      this.disableButtonApplyFilters = false;
    }
  }

  private isValidCpf(): ValidatorFn {
    return (control: AbstractControl): Validators => {
      if (control.value !== undefined && control.value.length > 0 ) {
        return !cpf.isValid(control.value) ? { cpfNotValid: true } : null;
      }
    };
  }

  private changeParamsGet(requestId: string, companyId: string): CatStatusRequest {
    const params = {
      companyId: companyId,
      requestId: requestId,
    };

    return params;
  }

  private changeParamsGetTable(requestId: string, companyId: string): CatValuesRequest {
    const params = {
      companyId: companyId,
      requestId: requestId,
      page: this.page++,
      pageSize: 20
    };

    return params;
  }

  private getBranches(): void {
    const companyId = this.CatEnvironmentService.getCompany();
    const pageSize = 20;
    const branchs = [];
    const params: BranchRequest = {
      companyId,
      page: 1,
      pageSize,
    };

    this.socialListBranchService.getListBranchs(params).pipe(expand(response =>
      response.hasNext ? this.socialListBranchService.getListBranchs(params, ++params.page) : EMPTY
    )).subscribe(response => {
        response.items.forEach(branch => {
          this.listBranch = [...this.listBranch, {
            label: `${branch.branchCode}-${branch.branchDescription}`,
            value: branch.branchCode,
          }];
        });
    });
  }
}
