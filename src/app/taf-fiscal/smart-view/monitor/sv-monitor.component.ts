import { Component, OnInit } from '@angular/core';
import { LiteralService } from 'literals';

@Component({
  selector: 'app-sv-monitor',
  templateUrl: './sv-monitor.component.html',
  styleUrls: ['./sv-monitor.component.scss']
})
export class SmartViewMonitorComponent implements OnInit {
  public literals: object;
  public headerTitle: string = '';

  constructor(private literalService: LiteralService) {
    this.literals = this.literalService.literalsTafFiscal;
  }

  ngOnInit(): void {
    this.setValueLiterals();
  }

  private setValueLiterals(): void {
    this.headerTitle = this.literals['svMonitor']['title'];
  }
}