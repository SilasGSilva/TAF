import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { TributeReport } from '../../taf-social/conference-reports/conference-reports-models/TributeReport';

const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root',
})
export class DownloadService {
  constructor() {}

  public download(
    filename: string,
    title: string,
    fieldsName: Array<any>,
    data: Array<any>
  ) {
    const resultData = [];

    resultData.push(fieldsName);
    data.map(reportData => resultData.push(reportData));

    const worksheetReinf: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      resultData,
      {
        skipHeader: true,
      }
    );

    const workbook: XLSX.WorkBook = {
      Sheets: { [title]: worksheetReinf },
      SheetNames: [title],
    };

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    this.saveAsExcelFile(excelBuffer, filename);
  }

  public downloadXLSX(tributeReport: TributeReport) {
    let xlsxWorkbook: XLSX.WorkBook;

    if (tributeReport.tribute.type === '1') {
      const worksheetValues: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
        tributeReport.tribute.inss.dataValues,
        {
          skipHeader: true,
        }
      );

      if (
        !worksheetValues['!merges'] &&
        !!tributeReport.tribute.inss.mergedCells
      ) {
        worksheetValues['!merges'] = tributeReport.tribute.inss.mergedCells;
      }

      if (tributeReport.synthetic) {
        xlsxWorkbook = {
          Sheets: {
            '1 - Sintético': worksheetValues,
          },
          SheetNames: ['1 - Sintético'],
        };
      } else {
        xlsxWorkbook = {
          Sheets: {
            '1 - Analítico': worksheetValues,
          },
          SheetNames: ['1 - Analítico'],
        };
      }
    } else if (tributeReport.tribute.type === '2') {
      const worksheetDeposits: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
        tributeReport.tribute.fgts.resultDeposits,
        {
          skipHeader: true,
        }
      );

      const worksheetBasis: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
        tributeReport.tribute.fgts.resultBasis,
        {
          skipHeader: true,
        }
      );

      xlsxWorkbook = {
        Sheets: {
          '1 - Base': worksheetBasis,
          '2 - Depósitos': worksheetDeposits,
        },
        SheetNames: ['1 - Base', '2 - Depósitos'],
      };
    } else {
      const worksheetValues: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
        tributeReport.tribute.irrf.dataValues,
        {
          skipHeader: true,
        }
      );
      const worksheetValuesAgglutinated: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
        tributeReport.tribute.irrf.dataValuesAgglutinated ?? [],
        {
          skipHeader: true,
        }
      );

      if (
        !worksheetValues['!merges'] &&
        !!tributeReport.tribute.irrf.mergedCells
      ) {
        worksheetValues['!merges'] = tributeReport.tribute.irrf.mergedCells;
      }

      if (tributeReport.synthetic) {
        xlsxWorkbook = {
          Sheets: {
            '1 - Sintético': worksheetValues,
          },
          SheetNames: ['1 - Sintético'],
        };
      } else {
        xlsxWorkbook = {
          Sheets: {
            'Analítico|Demonstr.Individuais': worksheetValues,
            'Analítico|Demonstr.Aglutinados': worksheetValuesAgglutinated,
          },
          SheetNames: ['Analítico|Demonstr.Individuais', 'Analítico|Demonstr.Aglutinados'],
        };
      }
    }

    const excelBuffer = XLSX.write(xlsxWorkbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    this.saveAsExcelFile(excelBuffer, tributeReport.fileName);
  }

  private saveAsExcelFile(buffer, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(
      data,
      fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
    );
  }
}
