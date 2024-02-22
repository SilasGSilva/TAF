import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-irrf-report-card',
  templateUrl: './irrf-report-card.component.html',
  styleUrls: ['./irrf-report-card.component.scss']
})
export class IrrfReportCardComponent {
  @Input('quantity') cardQuantity: string;
  @Input('description') cardDescription: string;
  @Input('column-size-grid-system') columnSizeGridSystem: string = '6';

  public changeBackground: boolean;
  public widgetClass: string;

  constructor() { }

  ngOnInit(): void {
    this.widgetClass = `po-xl-${this.columnSizeGridSystem} po-lg-${this.columnSizeGridSystem} po-md-12 po-sm-12 space-20`;
  }
}
