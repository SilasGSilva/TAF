import { CommonModule } from '@angular/common';
import { Injectable, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MonitorStatusEnvironmentComponent } from './monitor-status-environment.component';

@Injectable({
  providedIn: 'root',
})
@NgModule({
  declarations: [MonitorStatusEnvironmentComponent],
  imports: [BrowserModule, CommonModule],
  exports: [MonitorStatusEnvironmentComponent],
})
export class MonitorStatusEnvironmentModule {}
