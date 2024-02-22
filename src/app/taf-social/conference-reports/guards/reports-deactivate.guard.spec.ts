import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { DialogModalResponse } from '../../../shared/dialog-modal-response/dialog-modal-response.service';
import { IReportsCanDeactivate } from './ireports-deactivate';
import { ReportsDeactivateGuard } from './reports-deactivate.guard';

xdescribe('ReportsDeactivateGuard', () => {
  let guard: ReportsDeactivateGuard;

  class MockDialogModalResponse {
    public readonly dialogResponse$: Observable<boolean> = of(true);
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: DialogModalResponse, useClass: MockDialogModalResponse },
        ReportsDeactivateGuard,
        HttpClient,
        HttpHandler,
      ],
    });
    guard = TestBed.inject(ReportsDeactivateGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should activate the route when ask for discarts report', () => {
    const mockComponent: IReportsCanDeactivate = {
      discardReport: () => true,
      discardReportDialog: () => null,
    };
    const mockCurrentRoute: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();
    const mockCurrentState: RouterStateSnapshot = {
      url: '/fgtsReport',
      root: mockCurrentRoute,
    };

    expect(
      guard.canDeactivate(mockComponent, mockCurrentRoute, mockCurrentState)
    ).toBeTruthy();
  });

  it('should activate the route when not ask for discarts report', () => {
    const mockComponent: IReportsCanDeactivate = {
      discardReport: () => false,
      discardReportDialog: () => null,
    };
    const mockCurrentRoute: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();
    const mockCurrentState: RouterStateSnapshot = {
      url: '/fgtsReport',
      root: mockCurrentRoute,
    };

    expect(
      guard.canDeactivate(mockComponent, mockCurrentRoute, mockCurrentState)
    ).toBeTruthy();
  });

  it('should activate the route when ask for save data for INSS report', () => {
    const mockComponent: IReportsCanDeactivate = {
      dataSave: () => true,
      dataSaveDialog: () => null,
      discardReport: () => false,
      discardReportDialog: () => null,
    };
    const mockCurrentRoute: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();
    const mockCurrentState: RouterStateSnapshot = {
      url: '/inssReport',
      root: mockCurrentRoute,
    };

    expect(
      guard.canDeactivate(mockComponent, mockCurrentRoute, mockCurrentState)
    ).toBeTruthy();
  });

  it('should activate the route when not ask for save data for INSS report', () => {
    const mockComponent: IReportsCanDeactivate = {
      dataSave: () => false,
      dataSaveDialog: () => null,
      discardReport: () => false,
      discardReportDialog: () => null,
    };
    const mockCurrentRoute: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();
    const mockCurrentState: RouterStateSnapshot = {
      url: '/inssReport',
      root: mockCurrentRoute,
    };

    expect(
      guard.canDeactivate(mockComponent, mockCurrentRoute, mockCurrentState)
    ).toBeTruthy();
  });
});
