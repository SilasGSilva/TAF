import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { AEIModule } from 'angular-erp-integration';
import { ProtheusLibCoreModule } from '@totvs/protheus-lib-core';
import { PoPageDynamicSearchModule } from '@po-ui/ng-templates';
import { PoAccordionModule, PoBreadcrumbModule, PoButtonModule, PoContainerModule, PoDialogModule, PoFieldModule, PoLoadingModule, PoMenuModule, PoModalModule, PoNotificationModule, PoPageModule, PoTableModule, PoTabsModule, PoToolbarModule, PoTooltipModule } from '@po-ui/ng-components';
import { LaborProcessComponent } from './labor-process.component';
import { LaborProcessRoutingModule } from './labor-process-routing.module';
import { LaborProcessDetailComponent } from './pages/labor-process-detail/labor-process-detail.component';
import { LaborProcessListComponent } from './pages/labor-process-list/labor-process-list.component';
import { ProcessIdentificationComponent } from './pages/labor-process-detail/components/process-identification/process-identification.component';
import { ErrorMessageComponent } from './components/error-message/error-message.component';
import { FinancialInputComponent } from './components/financial-input/financial-input.component';
import { SearchFieldComponent } from './components/search-field/search-field.component';
import { FieldModalFormGroupComponent } from './components/field-modal-form-group/field-modal-form-group.component';
import { ModalFormGroupComponent } from './components/modal-form-group/modal-form-group.component';
import { LaborerInformationComponent } from './pages/labor-process-detail/components/laborer-information/laborer-information.component';
import { EmploymentContractComponent } from './pages/labor-process-detail/components/employment-contract/employment-contract.component';
import { PeriodIdentificationComponent } from './pages/labor-process-detail/components/period-identification/period-identification.component';
import { NatureOfActivityComponent } from './pages/labor-process-detail/components/nature-of-activity/nature-of-activity.component';
import { BondsOrContractsComponent } from './pages/labor-process-detail/components/bonds-or-contracts/bonds-or-contracts.component';
import { AdditionalInformationEmploymentContractComponent } from './pages/labor-process-detail/components/additional-information-employment-contract/additional-information-employment-contract.component';
import { EmploymentRelationshipComponent } from './pages/labor-process-detail/components/employment-relationship/employment-relationship.component';
import { ListOfEmploymentContractComponent } from './pages/labor-process-detail/components/list-of-employment-contract/list-of-employment-contract.component';
import { EmploymentContractModalComponent } from './pages/labor-process-detail/components/employment-contract-modal/employment-contract-modal.component';
import { LaborProcessTaxListComponent } from './pages/labor-process-tax-list/labor-process-tax-list.component';
import { LaborProcessTaxDetailComponent } from './pages/labor-process-tax-detail/labor-process-tax-detail.component';
import { CalculationPeriodAndBasisComponent } from './pages/labor-process-tax-detail/components/calculation-period-and-basis/calculation-period-and-basis.component';
import { SocialContributionsComponent } from './pages/labor-process-tax-detail/components/social-contributions/social-contributions.component';
import { IrrfInformationComponent } from './pages/labor-process-tax-detail/components/irrf-information/irrf-information.component';
import { WorkerModalComponent } from './pages/labor-process-tax-detail/components/worker-modal/worker-modal.component';
import { YearsBaseIndemnityComponent } from './pages/labor-process-detail/components/years-base-indemnity/years-base-indemnity.component';
import { WithholdingAndDependentInformationComponent } from './pages/labor-process-tax-detail/components/withholding-and-dependent-information/withholding-and-dependent-information.component';
import { DependentInformationComponent } from './pages/labor-process-tax-detail/components/withholding-and-dependent-information/dependent-information/dependent-information.component';
import { IncomeTaxInformationComponent } from './pages/labor-process-tax-detail/components/irrf-information/income-tax-information/income-tax-information.component';
import { DependentDeductionComponent } from './pages/labor-process-tax-detail/components/irrf-information/dependent-deduction/dependent-deduction.component';
import { AlimonyInformationComponent } from './pages/labor-process-tax-detail/components/irrf-information/alimony-information/alimony-information.component';
import { AdditionalInformationRraComponent } from './pages/labor-process-tax-detail/components/irrf-information/additional-information-rra/additional-information-rra.component';
import { ExpensesLegalProceedingsComponent } from './pages/labor-process-tax-detail/components/irrf-information/expenses-legal-proceedings/expenses-legal-proceedings.component';
import { LawyersIdentificationComponent } from './pages/labor-process-tax-detail/components/irrf-information/lawyers-identification/lawyers-identification.component';
import { WithholdingAndJudicialDepositsComponent } from './pages/labor-process-tax-detail/components/irrf-information/withholding-and-judicial-deposits/withholding-and-judicial-deposits.component';
import { ValuesInformationComponent } from './pages/labor-process-tax-detail/components/irrf-information/withholding-and-judicial-deposits/values-information/values-information.component';
import { DeductionsSuspendedEligibilityComponent } from './pages/labor-process-tax-detail/components/irrf-information/withholding-and-judicial-deposits/values-information/deductions-suspended-eligibility/deductions-suspended-eligibility.component';
import { DeductionsAndBeneficiariesComponent } from './pages/labor-process-tax-detail/components/irrf-information/withholding-and-judicial-deposits/values-information/deductions-suspended-eligibility/deductions-and-beneficiaries/deductions-and-beneficiaries.component';
import { LaborProcessDataStateService } from './service/labor-process-data-state.service';
import { LaborProcessTaxInfoService } from './service/labor-process-tax-info.service';
import { LaborProcessService } from './service/labor-process.service';
import { ESocialVersionService } from './service/e-social-version.service';

@NgModule({
  declarations: [
    LaborProcessComponent,
    LaborProcessDetailComponent,
    LaborProcessListComponent,
    ProcessIdentificationComponent,
    ErrorMessageComponent,
    LaborerInformationComponent,
    EmploymentContractComponent,
    PeriodIdentificationComponent,
    NatureOfActivityComponent,
    BondsOrContractsComponent,
    AdditionalInformationEmploymentContractComponent,
    EmploymentRelationshipComponent,
    ListOfEmploymentContractComponent,
    EmploymentContractModalComponent,
    SearchFieldComponent,
    LaborProcessTaxListComponent,
    LaborProcessTaxDetailComponent,
    CalculationPeriodAndBasisComponent,
    SocialContributionsComponent,
    IrrfInformationComponent,
    WorkerModalComponent,
    FinancialInputComponent,
    YearsBaseIndemnityComponent,
    WithholdingAndDependentInformationComponent,
    DependentInformationComponent,
    IncomeTaxInformationComponent,
    DependentDeductionComponent,
    AlimonyInformationComponent,
    AdditionalInformationRraComponent,
    ExpensesLegalProceedingsComponent,
    LawyersIdentificationComponent,
    WithholdingAndJudicialDepositsComponent,
    ValuesInformationComponent,
    FieldModalFormGroupComponent,
    ModalFormGroupComponent,
    DeductionsSuspendedEligibilityComponent,
    DeductionsAndBeneficiariesComponent,
  ],
  exports: [LaborProcessComponent],
  imports: [
    CommonModule,
    LaborProcessRoutingModule,
    PoPageModule,
    PoButtonModule,
    PoTabsModule,
    PoFieldModule,
    PoContainerModule,
    ReactiveFormsModule,
    PoTooltipModule,
    PoTableModule,
    PoAccordionModule,
    PoBreadcrumbModule,
    CurrencyMaskModule,
    BrowserAnimationsModule,
    PoMenuModule,
    PoModalModule,
    PoNotificationModule,
    PoLoadingModule,
    PoPageDynamicSearchModule,
    FormsModule,
    HttpClientModule,
    PoDialogModule,
    ProtheusLibCoreModule,
    AEIModule,
    PoToolbarModule,
  ],
  providers: [
    LaborProcessService,
    LaborProcessTaxInfoService,
    LaborProcessDataStateService,
    ESocialVersionService,
  ]
})
export class LaborProcessModule {}
