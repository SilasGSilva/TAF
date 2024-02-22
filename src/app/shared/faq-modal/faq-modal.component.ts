import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { PoModalAction, PoModalComponent } from '@po-ui/ng-components';
import { LiteralService } from 'core/i18n/literal.service';
import { FaqQuestionsSections } from './../../models/faq-questions-sections';
import { MoreInformations } from '../../models/more-informations';

@Component({
    selector: 'app-faq-modal',
    templateUrl: './faq-modal.component.html'
})
export class FaqModalComponent implements OnInit {
  @ViewChild(PoModalComponent, { static: true }) reportModalInformation: PoModalComponent;

  @Input('information-summary') informationSummary: string;
  @Input('title') title: string;
  @Input('faq-questions-sections') faqQuestionsSections: Array<FaqQuestionsSections>;
  @Input('more-informations') moreInformations: MoreInformations;

  public readonly literals: Object = {};
  public primaryAction: PoModalAction;
  private readonly isTAFFull: boolean = JSON.parse(sessionStorage.getItem('TAFFull'));

  constructor(
    private literalsService: LiteralService
  ) {
      this.literals = this.literalsService.literalsShared;
  }

  ngOnInit(): void {
    this.primaryAction = {
      action: () => {
          this.reportModalInformation.close();
      },
      label: this.literals['faqModal']['close'],
    };

    this.faqQuestionsSections.forEach((item) => {
      item.questions = item
      .questions.filter(information => (this.isTAFFull ? true : !information.tafFull))
      .map(({ questionTitle, questionAnswer, tafFull }) => ({ 
        questionTitle, 
        questionAnswer: String(questionAnswer)?.split('\n'), 
        tafFull 
      }));
    });
  }

  public openModal(): void {
    this.reportModalInformation.open();
  }

  public openLink(): void {
    window.open(
      this.moreInformations.link,
      '_blank'
    );
  }
}